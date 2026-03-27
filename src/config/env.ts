import { z } from "zod";
import { Logger } from "@/utils/logger";

const logger = new Logger("Config:Env");

const envSchema = z.object({
  NODE_ENV: z.string(),
  NEXT_PUBLIC_APP_URL: z.string(),
});

// Cross-environment env getter (Node.js or Deno)
function getEnvVar(key: string): string {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  // @ts-ignore: Deno global
  if (typeof Deno !== 'undefined' && Deno.env && typeof Deno.env.get === 'function') {
    // @ts-ignore: Deno global
    return Deno.env.get(key) || '';
  }
  return '';
}

const validateEnv = () => {
  try {
    logger.info("Validating environment variables");
    const env = {
      NODE_ENV: getEnvVar('NODE_ENV'),
      NEXT_PUBLIC_APP_URL: getEnvVar('NEXT_PUBLIC_APP_URL'),
    };
    const parsed = envSchema.parse(env);
    logger.info("Environment variables validated successfully");
    return parsed;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join("."));
      logger.error("Invalid environment variables", { error: { missingVars } });
      throw new Error(
        `Invalid environment variables: ${missingVars.join(", ")}. Please check your .env file`
      );
    }
    throw error;
  }
};

export const env = validateEnv();
