import "dotenv/config";
import app from "./src/app.js";
import { createProxy } from "./src/middleware/proxy.js";

const PORT = process.env.PORT;

const server = createProxy(app);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
