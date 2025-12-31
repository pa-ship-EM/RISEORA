import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

const { Pool } = pg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
  max: 10,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 5,
  delayMs: number = 2000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      const errorMessage = error.message || '';
      const isRetryable = error.code === 'EAI_AGAIN' || 
                          error.code === 'ECONNRESET' ||
                          error.code === 'ENOTFOUND' ||
                          error.code === 'ETIMEDOUT' ||
                          errorMessage.includes('EAI_AGAIN') ||
                          errorMessage.includes('getaddrinfo');
      
      if (!isRetryable || attempt === maxRetries) {
        throw error;
      }
      
      const waitTime = delayMs * attempt;
      console.log(`Database operation failed (attempt ${attempt}/${maxRetries}): ${errorMessage}. Retrying in ${waitTime}ms...`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }
  
  throw lastError;
}
