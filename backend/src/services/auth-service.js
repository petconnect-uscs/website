import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as clientModel from "../models/client-model.js";
import * as adminModel from "../models/admin-model.js";

class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

function ensureJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new AppError("Configuração JWT_SECRET ausente no servidor.", 500);
  }

  return secret;
}

function createToken(payload) {
  const secret = ensureJwtSecret();

  return jwt.sign(payload, secret, {
    expiresIn: "7d",
  });
}

async function registerClient(payload) {
  const { name, email, cpf, password, phone } = payload;

  if (!name || !email || !cpf || !password) {
    throw new AppError("Nome, email, CPF e senha são obrigatórios.", 400);
  }

  const existingByEmail = await clientModel.findClientByEmail(email);
  if (existingByEmail) {
    throw new AppError("E-mail já cadastrado.", 409);
  }

  const existingByCpf = await clientModel.findClientByCpf(cpf);
  if (existingByCpf) {
    throw new AppError("CPF já cadastrado.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const client = await clientModel.createClient({
    name,
    email,
    cpf,
    passwordHash,
    phone,
  });

  const token = createToken({
    id: client.id,
    role: "client",
  });

  return { token };
}

async function login(payload) {
  const { email, password } = payload;

  if (!email || !password) {
    throw new AppError("E-mail e senha são obrigatórios.", 400);
  }

  const client = await clientModel.findClientByEmail(email);

  if (client) {
    const isValidPassword = await bcrypt.compare(
      password,
      client.password_hash
    );

    if (isValidPassword) {
      const token = createToken({
        id: client.id,
        role: "client",
      });

      return { token };
    }
  }

  const admin = await adminModel.findAdminByEmail(email);

  if (admin) {
    const isValidPassword = await bcrypt.compare(password, admin.password_hash);

    if (isValidPassword) {
      const token = createToken({
        id: admin.id,
        role: "admin",
      });

      return { token };
    }
  }

  throw new AppError("Usuário ou senha incorretos.", 401);
}

async function getAuthenticatedUser(userFromToken) {
  const { id, role } = userFromToken;

  if (!id || !role) {
    throw new AppError("Token inválido.", 401);
  }

  if (role === "client") {
    const client = await clientModel.findClientById(id);

    if (!client) {
      throw new AppError("Cliente não encontrado.", 404);
    }

    return {
      id: client.id,
      name: client.name || client.nome,
      email: client.email,
      role: "client",
    };
  }

  if (role === "admin") {
    const admin = await adminModel.findAdminById(id);

    if (!admin) {
      throw new AppError("Admin não encontrado.", 404);
    }

    return {
      id: admin.id,
      name: admin.name || admin.nome,
      email: admin.email,
      role: "admin",
    };
  }

  throw new AppError("Tipo de usuário inválido no token.", 401);
}

export { AppError, registerClient, login, getAuthenticatedUser };
