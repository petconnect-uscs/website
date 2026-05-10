import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id?: string;
      cpf?: string;
      admin_id?: string;
      role?: "client" | "admin";
    };
  }
}

export {};

