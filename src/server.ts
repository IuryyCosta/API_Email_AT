import { app } from "./app";
import { env } from "./schemas";
import { knex } from "./database/config";

async function connectToOracle() {
  const connection = await knex()
  if(connection) {
    console.log("Connected to Oracle");
  } else {
    console.log("Failed to connect to Oracle");
  }
}

connectToOracle();

app.listen({
  port: env.PORT,
  host: "0.0.0.0",
}).then(() => {
  console.log(`HTTP server running! http://localhost:${env.PORT}`);
});

