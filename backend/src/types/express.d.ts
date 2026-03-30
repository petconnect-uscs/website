import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      cpf?: string;
      admin_id?: string;
      role?: "client" | "admin";
    };
  }
}

export {};

