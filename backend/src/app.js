import express from "express";
import authRoutes from "./routes/auth-routes.js";
import adminRoutes from "./routes/admin-routes.js";

const app = express();

app.use(express.json());

app.get("/", (res) => {
  res.status(200).json({ msg: "Servidor rodando na porta 3002" });
});

app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);

export default app;
