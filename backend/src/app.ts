import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "@/routes/auth-routes.ts";
import clientRoutes from "@/routes/client-routes.ts";
import adminRoutes from "@/routes/admin-routes.ts";
import petRoutes from "@/routes/pet-routes.ts";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(express.json());
app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (_req, res) => {
  res.status(200).json({ msg: "Servidor rodando na porta 3002" });
});

  app.use("/auth", authRoutes);
  app.use("/client", clientRoutes);
  app.use("/admin", adminRoutes);
  app.use("/pet", petRoutes);

export default app;
