import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema';

export const db = drizzle(process.env.DATABASE_URL!, { schema });

// Export all schemas for easy importing
export * from './schema';

// Export the database instance with schema
export { db };