require("dotenv").config();
const app = require("./src/app");
const { createProxy } = require("./src/middleware/proxy");

const PORT = process.env.PORT || 3000;

const server = createProxy(app);

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
