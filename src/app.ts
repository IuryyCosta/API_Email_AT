import fastify from "fastify";
import { SendEmailController } from "./controller/SendEmail";
import { getOracleConnection } from "./service/oracle";
import { env } from "./schemas";
import { SendAutomatic } from "./service/sendAutomatic";

export const app = fastify();

getOracleConnection(env.ORACLE_HOST, env.ORACLE_USER, env.ORACLE_PASSWORD, env.ORACLE_DATABASE);

const automaticService = new SendAutomatic();
automaticService.scheduleExecution();

app.get("/", async (request, reply) => {
  const sendEmailController = new SendEmailController();
  const { message } = await sendEmailController.create();
  return reply.status(200).send({message });
});
