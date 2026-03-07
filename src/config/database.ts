import { Pool } from 'pg';
import { Kysely, PostgresDialect } from 'kysely';
import { Database } from '../types/database.types.js';
import { env } from './env.js';

const pool = new Pool({
  connectionString: env.PG_SUPABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Important for Supabase
  },
  // Recommended additional options:
  max: 20, // Maximum number of clients in the pool
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 10000, // Return an error after 10 seconds if connection not established
});

// Create Kysely instance for type-safe queries
export const db = new Kysely<Database>({
  dialect: new PostgresDialect({ pool }),
});

// Set up event listeners before any connections
pool.on('connect', () => {
  console.log('DB successfully connected');
});

pool.on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
  // Don't exit the process - pg will handle reconnection
});

// Test connection immediately
async function testConnection(): Promise<void> {
  try {
    console.log('🔄 Testing database connection...');
    console.log('Connection string:', env.PG_SUPABASE_URL ? '✅ Found' : '❌ Missing');

    const client = await pool.connect();
    console.log('✅ Client acquired from pool');

    const result = await client.query('SELECT NOW()');
    console.log('✅ Query successful:', result.rows[0]);

    client.release();
    console.log('✅ Client released back to pool');
  } catch (err) {
    const error = err as Error & { code?: string };
    console.error('❌ Connection test failed:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
  }
}

testConnection();

// Export pool for backward compatibility during migration
export default pool;
