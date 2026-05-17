import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(8080),
  LOG_LEVEL: z.string().default('info'),
  DATABASE_URL: z.string().url(),
  FIREBASE_PROJECT_ID: z.string().min(1),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),
  GCS_BUCKET: z.string().min(1),
  CORS_ORIGINS: z.string().default(''),
});

export const env = envSchema.parse(process.env);

export const corsOrigins = env.CORS_ORIGINS.split(',').map(s => s.trim()).filter(Boolean);
