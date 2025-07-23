import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '@/models/Schema';
import { Env } from './Env';

const pool = new Pool({
  connectionString: Env.DATABASE_URL,
});
const db = drizzle({ client: pool, schema });

export { db };
