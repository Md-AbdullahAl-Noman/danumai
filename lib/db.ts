import { Pool } from "pg";

declare global {
  var __pgPool: Pool | undefined;
  var __schemaReady: Promise<void> | undefined;
}

function createPool() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  return new Pool({
    connectionString,
    ssl:
      process.env.PGSSL === "false"
        ? undefined
        : { rejectUnauthorized: false },
  });
}

export const pool = global.__pgPool ?? createPool();
if (process.env.NODE_ENV !== "production") global.__pgPool = pool;

async function initSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text UNIQUE NOT NULL,
      name text NOT NULL,
      tagline text NOT NULL DEFAULT '',
      description text NOT NULL DEFAULT '',
      status text NOT NULL DEFAULT '',
      features jsonb NOT NULL DEFAULT '[]',
      accent text NOT NULL DEFAULT '#d99a4e',
      image_url text,
      sort_order integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      slug text UNIQUE NOT NULL,
      title text NOT NULL,
      team text NOT NULL DEFAULT '',
      location text NOT NULL DEFAULT '',
      type text NOT NULL DEFAULT '',
      summary text NOT NULL DEFAULT '',
      points jsonb NOT NULL DEFAULT '[]',
      published boolean NOT NULL DEFAULT true,
      sort_order integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now(),
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- Editable marketing copy for the public site. One row per homepage/footer
    -- section, keyed by section name; the value is a JSON blob whose shape is
    -- defined per-section in lib/content.ts. Missing rows fall back to the
    -- built-in defaults, so the site always renders even before anything is
    -- edited from the admin panel.
    CREATE TABLE IF NOT EXISTS site_content (
      key text PRIMARY KEY,
      value jsonb NOT NULL DEFAULT '{}',
      updated_at timestamptz NOT NULL DEFAULT now()
    );

    -- People who applied to an open role from the careers page. Captured
    -- alongside the notification email so the admin panel has a durable record.
    CREATE TABLE IF NOT EXISTS applications (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      job_title text NOT NULL DEFAULT '',
      name text NOT NULL,
      email text NOT NULL,
      portfolio text NOT NULL DEFAULT '',
      note text NOT NULL DEFAULT '',
      read boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    -- Messages sent through the public contact form, stored so they can be
    -- triaged from the admin panel rather than living only in the inbox.
    CREATE TABLE IF NOT EXISTS contact_messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      name text NOT NULL,
      email text NOT NULL,
      topic text NOT NULL DEFAULT 'General',
      message text NOT NULL DEFAULT '',
      read boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now()
    );

    -- Projects gained a published flag after the initial release; add it in a
    -- backwards-compatible way so existing databases pick it up on next boot.
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS published boolean NOT NULL DEFAULT true;
  `);
}

export async function ensureSchema() {
  if (!global.__schemaReady) {
    global.__schemaReady = (async () => {
      try {
        await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
      } catch {
        // Managed Postgres providers may restrict CREATE EXTENSION when the
        // extension (or gen_random_uuid) is already available by default.
      }
      await initSchema();
    })().catch((err) => {
      global.__schemaReady = undefined;
      throw err;
    });
  }
  return global.__schemaReady;
}

export async function query<T extends Record<string, unknown> = Record<string, unknown>>(
  text: string,
  params?: unknown[]
) {
  await ensureSchema();
  return pool.query<T>(text, params);
}
