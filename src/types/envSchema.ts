import { z } from "zod";
import {
  handleZodError,
  stringNonEmpty,
} from "@/utils/zodUtils";

// -------- Number Schema ---------
const numberSchema = z.coerce
  .number()
  .int({ message: "Must be an integer number." })
  .positive({ message: "Must be a positive number." });

// -------- ENV Schema ---------
export const envSchema = z.object({
  // Environment
  NODE_ENV: z.enum(["development", "production"]).default("development"),

  // Domains
  CLIENT_URL: stringNonEmpty().url(),
  SERVER_URL: stringNonEmpty().url(),
  SERVER_API_URL: stringNonEmpty().url(),

  // JWT
  JWT_SECRET: stringNonEmpty(),

  // Google Config
  GOOGLE_CLIENT_ID: stringNonEmpty(),
  GOOGLE_CLIENT_SECRET: stringNonEmpty(),
  GOOGLE_REDIRECT_URI: stringNonEmpty(),

  // Keywords
  KEYWORDS_API_KEY: stringNonEmpty(),
  KEYWORDS_URL_ENDPOINT: stringNonEmpty().url(),

  // SMTP Configuration
  ZOHO_SMTP_HOST: stringNonEmpty().default("smtp.zoho.com"),
  ZOHO_SMTP_PORT: z.preprocess(
    (x) => (x ? Number(x) : undefined),
    numberSchema.min(1).max(65536).default(587),
  ),
  ZOHO_SMTP_USERNAME: stringNonEmpty().email(),
  ZOHO_SMTP_PASSWORD: stringNonEmpty(),

  // OpenAI API Key
  OPENAI_API_KEY: stringNonEmpty(),
  ADMIN_API_KEY: stringNonEmpty(),
});

// Infer ENV type from the schema
type Env = z.infer<typeof envSchema>;

export let ENV: Env;
try {
  ENV = envSchema.parse(process.env);
} catch (error) {
  console.log(error)
  handleZodError(error);
}