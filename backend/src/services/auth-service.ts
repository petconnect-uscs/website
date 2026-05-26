import { createHash, randomBytes } from "crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as clientModel from "@/models/client-model.ts";
import * as adminModel from "@/models/admin-model.ts";
import * as passwordResetTokenModel from "@/models/password-reset-token-model.ts";
import { sendPasswordResetEmail } from "@/services/email-service.ts";

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
const PASSWORD_RESET_MESSAGE =
  "Se o e-mail estiver cadastrado, enviaremos instruções para redefinir a senha.";
const MIN_PASSWORD_LENGTH = 8;

type TokenPayload =
  | { cpf: string; role: "client" }
  | { admin_id: string; role: "admin" };

type AuthenticatedUser =
  | { cpf: string; name: string; email: string; role: "client" }
  | { admin_id: string; name: string; email: string; role: "admin" };

function createToken(payload: TokenPayload) {
  if (!JWT_SECRET) {
    throw new AppError("Configuração JWT_SECRET ausente no servidor.", 500);
  }

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
  });
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeCpf(cpf: string) {
  return cpf.replace(/\D/g, "");
}

function isValidCpf(cpf: string) {
  const digits = normalizeCpf(cpf);

  if (digits.length !== 11) {
    return false;
  }

  if (/^(\d)\1{10}$/.test(digits)) {
    return false;
  }

  const calcCheckDigit = (slice: string, weights: number[]) => {
    const sum = slice
      .split("")
      .reduce((acc, digit, index) => acc + Number(digit) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };

  const firstDigit = calcCheckDigit(digits.slice(0, 9), [10, 9, 8, 7, 6, 5, 4, 3, 2]);
  if (firstDigit !== Number(digits[9])) {
    return false;
  }

  const secondDigit = calcCheckDigit(digits.slice(0, 10), [
    11, 10, 9, 8, 7, 6, 5, 4, 3, 2,
  ]);
  if (secondDigit !== Number(digits[10])) {
    return false;
  }

  return true;
}

function createTokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function getPasswordResetTtlMinutes() {
  const ttl = Number(process.env.PASSWORD_RESET_TOKEN_TTL_MINUTES ?? 30);

  if (!Number.isInteger(ttl) || ttl < 1 || ttl > 120) {
    throw new AppError(
      "Configuração PASSWORD_RESET_TOKEN_TTL_MINUTES inválida no servidor.",
      500,
    );
  }

  return ttl;
}

function buildPasswordResetUrl(token: string) {
  const baseUrl = process.env.PASSWORD_RESET_URL?.trim();
  if (!baseUrl) {
    throw new AppError("Configuração PASSWORD_RESET_URL ausente no servidor.", 500);
  }

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("token", token);
    return url.toString();
  } catch {
    throw new AppError("Configuração PASSWORD_RESET_URL inválida no servidor.", 500);
  }
}

async function registerClient(payload: {
  cpf?: string;
  name?: string;
  email?: string;
  birth_date?: string | null;
  password?: string;
}): Promise<{ token: string }> {
  const { cpf, name, email, birth_date, password } = payload;

  if (!cpf || !email || !name || !password) {
    throw new AppError("Nome, email, CPF e senha são obrigatórios.", 400);
  }

  const normalizedCpf = normalizeCpf(cpf);
  if (!isValidCpf(normalizedCpf)) {
    throw new AppError("CPF inválido.", 400);
  }

  const existingByEmail = await clientModel.findClientByEmail(email);
  if (existingByEmail) {
    throw new AppError("E-mail já cadastrado.", 409);
  }

  const existingByCpf = await clientModel.findClientByCpf(normalizedCpf);
  if (existingByCpf) {
    throw new AppError("CPF já cadastrado.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const client = await clientModel.createClient({
    cpf: normalizedCpf,
    name,
    email,
    birth_date: birth_date ?? null,
    passwordHash,
  });

  const token = createToken({
    cpf: client.cpf,
    role: "client",
  });

  return { token };
}

async function login(payload: {
  email?: string;
  password?: string;
}): Promise<{ token: string }> {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError("E-mail e senha são obrigatórios.", 400);
  }

  const client = await clientModel.findClientByEmail(email);
  if (client) {
    const isValidPassword = await bcrypt.compare(
      password,
      client.password || "",
    );
    if (isValidPassword) {
      const token = createToken({
        cpf: client.cpf,
        role: "client",
      });

      return { token };
    }
  }

  const admin = await adminModel.findAdminByEmail(email);
  if (admin) {
    const isValidPassword = await bcrypt.compare(
      password,
      admin.password || "",
    );

    if (isValidPassword) {
      const token = createToken({
        admin_id: admin.admin_id,
        role: "admin",
      });

      return { token };
    }
  }

  throw new AppError("Usuário ou senha incorretos.", 401);
}

async function requestPasswordReset(payload: {
  email?: string;
} = {}): Promise<{ message: string }> {
  const email = payload.email?.trim();

  if (!email) {
    throw new AppError("E-mail é obrigatório.", 400);
  }

  if (!isValidEmail(email)) {
    throw new AppError("E-mail inválido.", 400);
  }

  const client = await clientModel.findActiveClientByEmail(email);
  if (!client) {
    return { message: PASSWORD_RESET_MESSAGE };
  }

  const ttlMinutes = getPasswordResetTtlMinutes();
  const token = randomBytes(32).toString("hex");
  const tokenHash = createTokenHash(token);
  const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);

  await passwordResetTokenModel.createPasswordResetToken({
    clientCpf: client.cpf,
    tokenHash,
    expiresAt,
  });

  await sendPasswordResetEmail({
    to: client.email,
    name: client.name,
    resetUrl: buildPasswordResetUrl(token),
    expiresInMinutes: ttlMinutes,
  });

  return { message: PASSWORD_RESET_MESSAGE };
}

async function resetPassword(payload: {
  token?: string;
  password?: string;
  password_confirm?: string;
} = {}): Promise<{ message: string }> {
  const token = payload.token?.trim();
  const password = payload.password ?? "";
  const passwordConfirm = payload.password_confirm ?? "";

  if (!token) {
    throw new AppError("Token de recuperação é obrigatório.", 400);
  }

  if (!password || !passwordConfirm) {
    throw new AppError("Nova senha e confirmação são obrigatórias.", 400);
  }

  if (password !== passwordConfirm) {
    throw new AppError("As senhas não coincidem.", 400);
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    throw new AppError(
      `A nova senha deve ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`,
      400,
    );
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const result = await passwordResetTokenModel.resetClientPasswordWithToken({
    tokenHash: createTokenHash(token),
    passwordHash,
  });

  if (result !== "updated") {
    throw new AppError("Token inválido ou expirado.", 400);
  }

  return { message: "Senha alterada com sucesso." };
}

async function getAuthenticatedUser(userFromToken: {
  cpf?: string;
  admin_id?: string;
  role?: "client" | "admin";
}): Promise<AuthenticatedUser> {
  const { cpf, admin_id, role } = userFromToken;

  if (role === "client") {
    if (!cpf) throw new AppError("Token inválido.", 401);

    const client = await clientModel.findClientByCpf(cpf);
    if (!client) throw new AppError("Cliente não encontrado.", 404);

    return {
      cpf: client.cpf,
      name: client.name,
      email: client.email,
      role: "client",
    };
  }

  if (role === "admin") {
    if (!admin_id) throw new AppError("Token inválido.", 401);

    const admin = await adminModel.findAdminById(admin_id);
    if (!admin) throw new AppError("Admin não encontrado.", 404);

    return {
      admin_id: admin.admin_id,
      name: admin.name,
      email: admin.email,
      role: "admin",
    };
  }

  throw new AppError("Tipo de usuário inválido no token.", 401);
}

export {
  registerClient,
  login,
  requestPasswordReset,
  resetPassword,
  getAuthenticatedUser,
};
