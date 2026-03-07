import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["dev", "development", "production", "test"])
    .default("development"),
  PORT: z.string().regex(/^\d+$/).transform(Number),
  FE_URL: z.string().url(),

  // Database
  PG_SUPABASE_URL: z.string().min(1),

  // JWT
  ACCESS_TOKEN_SECRET_KEY: z.string().min(5),
  REFRESH_TOKEN_SECRET_KEY: z.string().min(5),

  // Cloudflare Image API
  CF_REQUEST_URL: z.string().url().optional(),
  CF_IMAGE_TOKEN: z.string().optional(),
  CF_ACCOUNT_ID: z.string().optional(),

  // Cloudflare R2
  CF_R2_BUCKET: z.string().optional(),
  R2_API_URL: z.string().url().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  BASE_CDN_URL_IMAGE: z.string().url().optional(),
});

export type Env = z.infer<typeof envSchema>;

// Parse and validate environment variables
export const env = envSchema.parse(process.env);
