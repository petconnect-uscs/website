import prisma from "@/prisma-client.ts";

export type Client = {
	cpf: string;
	name: string;
	email: string;
	birth_date?: string | null;
	password?: string;
};

function formatDateOnly(value: Date): string {
	return value.toISOString().slice(0, 10);
}

function toClient(row: {
	cpf: string;
	name: string;
	email: string;
	birth_date: Date;
	password: string;
}): Client {
	return {
		cpf: row.cpf,
		name: row.name,
		email: row.email,
		birth_date: formatDateOnly(row.birth_date),
		password: row.password,
	};
}

async function findClientByEmail(email: string): Promise<Client | null> {
	const row = await prisma.client.findUnique({
		where: { email },
	});
	return row ? toClient(row) : null;
}

async function findActiveClientByEmail(email: string): Promise<Client | null> {
	const row = await prisma.client.findFirst({
		where: { email, deleted_at: null },
	});
	return row ? toClient(row) : null;
}

async function findClientByCpf(cpf: string): Promise<Client | null> {
	const row = await prisma.client.findUnique({
		where: { cpf },
	});
	return row ? toClient(row) : null;
}

async function createClient(data: {
	cpf: string;
	name: string;
	email: string;
	birth_date?: string | null;
	passwordHash: string;
}): Promise<Client> {
	const { cpf, name, email, birth_date, passwordHash } = data;

	const birthDate =
		birth_date != null && birth_date !== ""
			? new Date(birth_date)
			: new Date("1970-01-01");

	const row = await prisma.client.create({
		data: {
			cpf,
			name,
			email,
			birth_date: birthDate,
			password: passwordHash,
		},
	});

	return toClient(row);
}

async function findClientById(cpf: string): Promise<Client | null> {
	return findClientByCpf(cpf);
}

export type ClientListRow = {
	cpf: string;
	name: string;
	birth_date: string | null;
	email: string;
};

export type AdminClientPetRow = {
	pet_id: string;
	name: string;
	birth_date: string | null;
	sex: string | null;
	breed_name: string | null;
	species_name: string | null;
	image_url: string | null;
	is_neutered: boolean | null;
	is_vaccinated: boolean | null;
	client_cpf: string | null;
	breed_id: string | null;
	species_id: string | null;
	created_at: string;
	updated_at: string;
	vaccines: string[];
};

export type AdminClientWithPetsRow = ClientListRow & {
	pets: AdminClientPetRow[];
};

async function findAllClients(): Promise<ClientListRow[]> {
	const rows = await prisma.client.findMany({
		where: { deleted_at: null },
		select: {
			cpf: true,
			name: true,
			birth_date: true,
			email: true,
		},
		orderBy: { name: "asc" },
	});

	return rows.map(
		(r: {
			cpf: string;
			name: string;
			birth_date: Date;
			email: string;
		}): ClientListRow => ({
			cpf: r.cpf,
			name: r.name,
			email: r.email,
			birth_date: r.birth_date ? formatDateOnly(r.birth_date) : null,
		}),
	);
}

async function findAllClientsWithPetsForAdmin(): Promise<
	AdminClientWithPetsRow[]
> {
	const rows = await prisma.client.findMany({
		where: { deleted_at: null },
		select: {
			cpf: true,
			name: true,
			birth_date: true,
			email: true,
			pet: {
				where: { deleted_at: null },
				select: {
					pet_id: true,
					name: true,
					birth_date: true,
					sex: true,
					image_url: true,
					is_neutered: true,
					is_vaccinated: true,
					client_cpf: true,
					breed_id: true,
					species_id: true,
					created_at: true,
					updated_at: true,
					breed: { select: { name: true } },
					species: { select: { name: true } },
					pet_vaccine: {
						select: {
							vaccine: { select: { name: true } },
						},
					},
				},
				orderBy: { name: "asc" },
			},
		},
		orderBy: { name: "asc" },
	});

	return rows.map(
		(r: {
			cpf: string;
			name: string;
			birth_date: Date;
			email: string;
			pet: {
				pet_id: string;
				name: string;
				birth_date: Date | null;
				sex: string | null;
				image_url: string | null;
				is_neutered: boolean | null;
				is_vaccinated: boolean | null;
				client_cpf: string | null;
				breed_id: string | null;
				species_id: string | null;
				created_at: Date;
				updated_at: Date;
				breed: { name: string } | null;
				species: { name: string } | null;
				pet_vaccine: { vaccine: { name: string } }[];
			}[];
		}): AdminClientWithPetsRow => ({
			cpf: r.cpf,
			name: r.name,
			email: r.email,
			birth_date: r.birth_date ? formatDateOnly(r.birth_date) : null,
			pets: r.pet.map((p) => ({
				pet_id: p.pet_id,
				name: p.name,
				birth_date: p.birth_date ? formatDateOnly(p.birth_date) : null,
				sex: p.sex,
				breed_name: p.breed?.name ?? null,
				species_name: p.species?.name ?? null,
				image_url: p.image_url ?? null,
				is_neutered: p.is_neutered ?? null,
				is_vaccinated: p.is_vaccinated ?? null,
				client_cpf: p.client_cpf ?? null,
				breed_id: p.breed_id ?? null,
				species_id: p.species_id ?? null,
				created_at: p.created_at.toISOString(),
				updated_at: p.updated_at.toISOString(),
				vaccines: p.pet_vaccine.map((pv) => pv.vaccine.name),
			})),
		}),
	);
}

async function deleteClientByCpf(cpf: string): Promise<{ cpf: string } | null> {
	const existing = await prisma.client.findFirst({
		where: { cpf },
	});
	if (!existing) return null;

	await prisma.client.delete({
		where: { cpf },
	});

	return { cpf };
}

export type ClientProfilePublic = {
	cpf: string;
	name: string;
	email: string;
	birth_date: string | null;
	created_at: Date;
	updated_at: Date;
};

function toClientProfilePublic(row: {
	cpf: string;
	name: string;
	email: string;
	birth_date: Date;
	created_at: Date;
	updated_at: Date;
}): ClientProfilePublic {
	return {
		cpf: row.cpf,
		name: row.name,
		email: row.email,
		birth_date: row.birth_date ? formatDateOnly(row.birth_date) : null,
		created_at: row.created_at,
		updated_at: row.updated_at,
	};
}

async function findClientNameByCpf(cpf: string): Promise<string | null> {
	const row = await prisma.client.findFirst({
		where: { cpf, deleted_at: null },
		select: { name: true },
	});
	return row ? row.name : null;
}

async function findActiveClientProfileByCpf(
	cpf: string,
): Promise<ClientProfilePublic | null> {
	const row = await prisma.client.findFirst({
		where: { cpf, deleted_at: null },
		select: {
			cpf: true,
			name: true,
			email: true,
			birth_date: true,
			created_at: true,
			updated_at: true,
		},
	});
	return row ? toClientProfilePublic(row) : null;
}

async function updateClientByCpf(
	cpf: string,
	data: { name?: string; password?: string },
): Promise<ClientProfilePublic | null> {
	const existing = await prisma.client.findFirst({
		where: { cpf, deleted_at: null },
	});
	if (!existing) return null;

	const row = await prisma.client.update({
		where: { cpf },
		data: {
			...data,
			updated_at: new Date(),
		},
		select: {
			cpf: true,
			name: true,
			email: true,
			birth_date: true,
			created_at: true,
			updated_at: true,
		},
	});

	return toClientProfilePublic(row);
}

export {
	findClientByEmail,
	findActiveClientByEmail,
	findClientByCpf,
	createClient,
	findClientById,
	findAllClients,
	findAllClientsWithPetsForAdmin,
	deleteClientByCpf,
	findActiveClientProfileByCpf,
	updateClientByCpf,
	findClientNameByCpf,
};
