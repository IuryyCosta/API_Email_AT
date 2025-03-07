import fastify from "fastify";
import { SendEmailController } from "./controller/SendEmail";


export const app = fastify();




app.get("/", async (request, reply) => {
  const sendEmailController = new SendEmailController();
  const { message } = await sendEmailController.create();
  return reply.status(200).send({message });
});
