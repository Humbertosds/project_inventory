import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { AppError } from '../utils/appError';

if (!process.env.DATABASE_URL) {
    throw new AppError('DATABASE_URL environment variable is not set', 500);
}

// Create postgres connection
const queryClient = postgres(process.env.DATABASE_URL);

// Create drizzle instance
export const db = drizzle(queryClient);
