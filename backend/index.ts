import "dotenv/config";
import app from "./src/app.ts";
import { createProxy } from "./src/middleware/proxy.ts";

const PORT = Number(process.env.PORT ?? 3002);

const server = createProxy(app);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

