import { z } from 'zod';

export const envSchema = z.object({
    PORT: z.string().transform(Number),
    NODE_ENV: z.enum(['development', 'production']),
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
});

export const env = envSchema.parse(process.env);

// TypeScript type
export type Env = z.infer<typeof envSchema>; 