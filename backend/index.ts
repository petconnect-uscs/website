import "dotenv/config";
import app from "./src/app.ts";
import { createProxy } from "./src/middleware/proxy.ts";

if (process.env.PORT == "3002") {
  const PORT = Number(3002);
  const server = createProxy(app);
  server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
  
} else {
  const PORT = Number(process.env.PORT ?? 8100);
  const HOST = process.env.IP ?? "::";
  const server = createProxy(app);
  server.listen(PORT, HOST, () => {
    console.log(`Servidor rodando em http://[${HOST}]:${PORT}`);
  });
}
