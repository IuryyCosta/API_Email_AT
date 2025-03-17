import { z } from "zod";
import "dotenv/config";


export const sendEmailSchema = z.object({
  PORT: z.coerce.number().default(3000),
  NODE_ENV: z.enum(["development", "production"]).default("production"),
  RESEND_API_KEY: z.string(),
  EMAIL_FROM: z.string(),
  EMAIL_TO: z.string(),
  ORACLE_HOST: z.string(),
  ORACLE_USER: z.string(),
  ORACLE_PASSWORD: z.string(),
  ORACLE_DATABASE: z.string(),
  ORACLE_LIB_DIR: z.string(),
  ORACLE_CONNECT_STRING: z.string(),
  EXECUTION_HOUR: z.string().transform(Number).pipe(
    z.number().min(0).max(23)
),
EXECUTION_MINUTE: z.string().transform(Number).pipe(
  z.number().min(0).max(59)
)
})

const _env = sendEmailSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}

export const env = _env.data;

