import nodemailer from "nodemailer";

type PasswordResetEmailData = {
	to: string;
	name: string;
	resetUrl: string;
	expiresInMinutes: number;
};

type SmtpConfig = {
	host: string;
	port: number;
	secure: boolean;
	user: string;
	pass: string;
	from: string;
};

function readRequiredEnv(name: string): string {
	const value = process.env[name]?.trim();
	if (!value) {
		throw new Error(`Configuração ${name} ausente no servidor.`);
	}
	return value;
}

function readSmtpConfig(): SmtpConfig {
	const host = readRequiredEnv("SMTP_HOST");
	const user = readRequiredEnv("SMTP_USER");
	const pass = readRequiredEnv("SMTP_PASS");
	const from = process.env.SMTP_FROM?.trim() || user;
	const port = Number(process.env.SMTP_PORT ?? 587);

	if (!Number.isInteger(port) || port < 1 || port > 65535) {
		throw new Error("Configuração SMTP_PORT inválida no servidor.");
	}

	const secure =
		process.env.SMTP_SECURE?.toLowerCase() === "true" || port === 465;

	return {
		host,
		port,
		secure,
		user,
		pass,
		from,
	};
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

async function sendPasswordResetEmail(data: PasswordResetEmailData) {
	const config = readSmtpConfig();
	const safeName = escapeHtml(data.name);
	const safeResetUrl = escapeHtml(data.resetUrl);
	const transporter = nodemailer.createTransport({
		host: config.host,
		port: config.port,
		secure: config.secure,
		auth: {
			user: config.user,
			pass: config.pass,
		},
	});

	await transporter.sendMail({
		from: config.from,
		to: data.to,
		subject: "Recuperação de senha - Connect Pet",
		text: [
			`Olá, ${data.name}.`,
			"",
			"Recebemos uma solicitação para redefinir a senha da sua conta.",
			`Acesse o link abaixo em até ${data.expiresInMinutes} minutos para criar uma nova senha:`,
			data.resetUrl,
			"",
			"Se você não solicitou essa alteração, ignore este e-mail.",
		].join("\n"),
		html: `
			<p>Olá, ${safeName}.</p>
			<p>Recebemos uma solicitação para redefinir a senha da sua conta.</p>
			<p>Acesse o link abaixo em até ${data.expiresInMinutes} minutos para criar uma nova senha:</p>
			<p><a href="${safeResetUrl}">Redefinir senha</a></p>
			<p>Se você não solicitou essa alteração, ignore este e-mail.</p>
		`,
	});
}

export { sendPasswordResetEmail };
