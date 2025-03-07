import { env } from "@/schemas";
import { Resend } from "resend";
import { htmlFile } from "../utils/htmlFile";




/**
 * @description Envia um email para o destinatário com o assunto "teste" e o corpo do email sendo o htmlFile
 * @returns {Promise<{ message: string }>}
 * @throws {Error} Se ocorrer um erro ao enviar o email
 * @example
 * const sendEmail = new SendEmailController();
 * sendEmail.create();
 */
export class SendEmailController {
  async create() {
  
    const { EMAIL_FROM, EMAIL_TO, RESEND_API_KEY } = env;

    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: "teste",
      html: await htmlFile(),
    });

    if (error) {
      throw new Error(error.message);
    }

    return { message: "Email sent successfully" };
  }
}
