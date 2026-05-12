import prisma from "@/prisma-client.ts";

export type PasswordResetToken = {
	reset_token_id: string;
	client_cpf: string;
	token_hash: string;
	expires_at: Date;
	used_at: Date | null;
	created_at: Date;
};

export type ResetPasswordWithTokenResult = "updated" | "invalid_token";

async function createPasswordResetToken(data: {
	clientCpf: string;
	tokenHash: string;
	expiresAt: Date;
}): Promise<PasswordResetToken> {
	const { clientCpf, tokenHash, expiresAt } = data;
	const now = new Date();

	return prisma.$transaction(async (tx) => {
		await tx.password_reset_token.updateMany({
			where: {
				client_cpf: clientCpf,
				used_at: null,
			},
			data: { used_at: now },
		});

		return tx.password_reset_token.create({
			data: {
				client_cpf: clientCpf,
				token_hash: tokenHash,
				expires_at: expiresAt,
			},
		});
	});
}

async function resetClientPasswordWithToken(data: {
	tokenHash: string;
	passwordHash: string;
	now?: Date;
}): Promise<ResetPasswordWithTokenResult> {
	const { tokenHash, passwordHash, now = new Date() } = data;

	return prisma.$transaction(async (tx) => {
		const token = await tx.password_reset_token.findUnique({
			where: { token_hash: tokenHash },
			include: {
				client: {
					select: {
						cpf: true,
						deleted_at: true,
					},
				},
			},
		});

		if (
			!token ||
			token.used_at ||
			token.expires_at <= now ||
			token.client.deleted_at
		) {
			return "invalid_token";
		}

		const consumed = await tx.password_reset_token.updateMany({
			where: {
				reset_token_id: token.reset_token_id,
				used_at: null,
				expires_at: { gt: now },
			},
			data: { used_at: now },
		});

		if (consumed.count !== 1) {
			return "invalid_token";
		}

		await tx.client.update({
			where: { cpf: token.client_cpf },
			data: {
				password: passwordHash,
				updated_at: now,
			},
		});

		return "updated";
	});
}

export { createPasswordResetToken, resetClientPasswordWithToken };
