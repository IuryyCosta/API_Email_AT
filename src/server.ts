import { app } from "./app";
import { env } from "./schemas";


/**
 * @description Conecta ao banco de dados Oracle
 * @returns {Promise<void>} - mensagem de conexão com o banco de dados
 * @throws {Error} - erro ao conectar ao banco de dados
 */


app.listen({
  port: env.PORT,
  host: "0.0.0.0",
}).then(() => {
  console.log(`HTTP server running! http://localhost:${env.PORT}`);
});

