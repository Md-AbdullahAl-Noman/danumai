// Seeds the database with the ventures/jobs that used to be hardcoded in
// components/sections/VentureShowcase.tsx and components/careers/JobList.tsx.
// Safe to re-run: existing rows (matched by slug) are left untouched.
//
// Usage: npm run seed   (requires DATABASE_URL in the environment or .env)

import { readFileSync, existsSync } from "node:fs";
import { Pool } from "pg";

function loadDotEnv() {
  if (process.env.DATABASE_URL) return;
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].replace(/^["']|["']$/g, "");
    }
  }
}

loadDotEnv();

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Add it to .env or export it before running the seed.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === "false" ? undefined : { rejectUnauthorized: false },
});

const projects = [
  {
    slug: "banglareels",
    name: "BanglaReels",
    tagline: "Short-form streaming for the Bangla-speaking world",
    description:
      "A vertical micro-drama platform built for how 300 million people actually watch — serialized stories, episode by episode, in their own language.",
    status: "In development",
    features: ["Vertical serials", "Episode unlocks", "Creator tooling", "Offline-first"],
    accent: "#e11d48",
    sort_order: 1,
  },
  {
    slug: "danumai-studios",
    name: "Danumai Studios",
    tagline: "Original stories, produced in-house",
    description:
      "The content engine behind our platforms. We write, produce, and own the serials we stream — no licensing, no middlemen, full creative control.",
    status: "In development",
    features: ["Writers' room", "Vertical-first production", "Owned IP", "Fast cycles"],
    accent: "#7c3aed",
    sort_order: 2,
  },
  {
    slug: "care-technology",
    name: "Care Technology",
    tagline: "Software for the people who look after people",
    description:
      "Tools that give caregivers time back — scheduling, coordination, and communication built around the realities of care work, not around billing codes.",
    status: "Research",
    features: ["Shift coordination", "Family updates", "Care logs", "Gentle reminders"],
    accent: "#0d9488",
    sort_order: 3,
  },
];

const jobs = [
  {
    slug: "founding-product-engineer",
    title: "Founding Product Engineer",
    team: "Danumai Labs",
    location: "Dhaka · Remote",
    type: "Full-time",
    summary:
      "Own features end to end across BanglaReels and the shared platform — from data model to the last easing curve.",
    points: [
      "TypeScript, React, Next.js across web and mobile web",
      "You've shipped and operated products, not just built them",
      "Care about motion, accessibility, and the last 5% of polish",
    ],
    sort_order: 1,
  },
  {
    slug: "motion-designer",
    title: "Product & Motion Designer",
    team: "Danumai Labs",
    location: "Remote",
    type: "Full-time",
    summary:
      "Define how Danumai products feel — a single design language spanning streaming, stories, and care.",
    points: [
      "Strong interaction and motion portfolio (Figma + prototypes)",
      "Comfortable working directly in the codebase with engineers",
      "Taste for restraint: one accent color, spacing over decoration",
    ],
    sort_order: 2,
  },
  {
    slug: "content-producer",
    title: "Content Producer, Serials",
    team: "Danumai Studios",
    location: "Dhaka",
    type: "Contract → Full-time",
    summary: "Run vertical micro-drama productions from script to screen for BanglaReels.",
    points: [
      "Experience producing short-form or episodic video",
      "Fluent Bangla; deep feel for what the audience actually watches",
      "Scrappy: small crews, fast cycles, owned outcomes",
    ],
    sort_order: 3,
  },
];

async function main() {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto;`);
  } catch {
    // ignore if restricted/already available
  }

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
  `);

  for (const p of projects) {
    await pool.query(
      `INSERT INTO projects (slug, name, tagline, description, status, features, accent, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (slug) DO NOTHING`,
      [p.slug, p.name, p.tagline, p.description, p.status, JSON.stringify(p.features), p.accent, p.sort_order]
    );
  }

  for (const j of jobs) {
    await pool.query(
      `INSERT INTO jobs (slug, title, team, location, type, summary, points, sort_order)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (slug) DO NOTHING`,
      [j.slug, j.title, j.team, j.location, j.type, j.summary, JSON.stringify(j.points), j.sort_order]
    );
  }

  console.log(`Seeded ${projects.length} projects and ${jobs.length} jobs (existing slugs left untouched).`);
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
