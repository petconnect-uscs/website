import express from "express";
import authRoutes from "./routes/auth-routes";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.status(200).json({ msg: "Servidor rodando na porta 3002" });
});

app.use("/auth", authRoutes);

export default app;

