import { env } from "@/schemas";
import { Resend } from "resend";
import { htmlFile } from "../utils/htmlFile";





export class SendEmailController {
  async create() {
  
    const { EMAIL_FROM, EMAIL_TO, RESEND_API_KEY } = env;

    const resend = new Resend(RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: EMAIL_TO,
      subject: "teste",
      html: htmlFile(),
    });
    if (error) {
      throw new Error(error.message);
    }

    return { message: "Email sent successfully" };
  }
}
