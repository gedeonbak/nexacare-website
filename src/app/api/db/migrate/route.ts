// ⚠️  ONE-TIME USE ONLY
// Run this endpoint once against a fresh RDS instance to create all PHI tables.
// IMMEDIATELY delete this file after the first successful migration:
//
//   git rm src/app/api/db/migrate/route.ts && git commit -m "Remove migration endpoint"
//
// Leaving this route deployed is a security risk.

import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  // Must be protected by a one-time secret set in .env.local
  const auth = req.headers.get('authorization');
  const secret = process.env.MIGRATION_SECRET;

  if (!secret) {
    return NextResponse.json(
      { error: 'MIGRATION_SECRET is not set — cannot run migration' },
      { status: 500 }
    );
  }

  if (auth !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    const client = await pool.connect();
    try {
      await client.query(schema);
      return NextResponse.json({
        success: true,
        message: 'Schema applied successfully. DELETE THIS ROUTE NOW.',
        tables: ['patients', 'carepath_message_log', 'pharmacy_orders'],
        next_step: 'git rm src/app/api/db/migrate/route.ts',
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('[migrate] Schema error:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        detail:
          error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// Explicitly block GET so it can't be triggered by a browser navigation
export function GET() {
  return NextResponse.json(
    { error: 'Use POST with Authorization header' },
    { status: 405 }
  );
}
