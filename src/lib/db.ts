import { Pool, PoolClient } from 'pg';

// Connection pool — reuses connections across
// requests in Next.js serverless functions.
// Only used server-side (API routes, Server Components).

const globalForPg = globalThis as unknown as {
  pool: Pool | undefined;
};

export const pool =
  globalForPg.pool ??
  new Pool({
    host:     process.env.DATABASE_HOST,
    port:     parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    database: process.env.DATABASE_NAME,
    user:     process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    ssl: {
      rejectUnauthorized: true,
    },
    max:                    10,
    idleTimeoutMillis:      30_000,
    connectionTimeoutMillis: 2_000,
  });

// In development, reuse the pool across hot-reloads to
// avoid exhausting the connection limit.
if (process.env.NODE_ENV !== 'production') {
  globalForPg.pool = pool;
}

// ── Query helpers ────────────────────────────────────────────────────────────

/** Run a query and return all rows. */
export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
}

/** Run a query and return at most one row. */
export async function queryOne<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows[0] ?? null;
}

/** Run multiple queries inside a single transaction. */
export async function transaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

export default pool;
