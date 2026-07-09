import { query } from "@/lib/db";

export type Job = {
  id: string;
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  points: string[];
  published: boolean;
  sortOrder: number;
};

type JobRow = {
  id: string;
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  points: string[];
  published: boolean;
  sort_order: number;
};

function mapRow(row: JobRow): Job {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    team: row.team,
    location: row.location,
    type: row.type,
    summary: row.summary,
    points: row.points ?? [],
    published: row.published,
    sortOrder: row.sort_order,
  };
}

export async function listJobs(opts: { publishedOnly?: boolean } = {}): Promise<Job[]> {
  const res = opts.publishedOnly
    ? await query<JobRow>(
        `SELECT * FROM jobs WHERE published = true ORDER BY sort_order ASC, created_at ASC`
      )
    : await query<JobRow>(`SELECT * FROM jobs ORDER BY sort_order ASC, created_at ASC`);
  return res.rows.map(mapRow);
}

export async function getJob(id: string): Promise<Job | null> {
  const res = await query<JobRow>(`SELECT * FROM jobs WHERE id = $1`, [id]);
  return res.rows[0] ? mapRow(res.rows[0]) : null;
}

export type JobInput = {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
  summary: string;
  points: string[];
  published: boolean;
  sortOrder: number;
};

export async function createJob(input: JobInput): Promise<Job> {
  const res = await query<JobRow>(
    `INSERT INTO jobs (slug, title, team, location, type, summary, points, published, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      input.slug,
      input.title,
      input.team,
      input.location,
      input.type,
      input.summary,
      JSON.stringify(input.points),
      input.published,
      input.sortOrder,
    ]
  );
  return mapRow(res.rows[0]);
}

export async function updateJob(id: string, input: JobInput): Promise<Job> {
  const res = await query<JobRow>(
    `UPDATE jobs SET
       slug = $2, title = $3, team = $4, location = $5, type = $6,
       summary = $7, points = $8, published = $9, sort_order = $10, updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      input.slug,
      input.title,
      input.team,
      input.location,
      input.type,
      input.summary,
      JSON.stringify(input.points),
      input.published,
      input.sortOrder,
    ]
  );
  return mapRow(res.rows[0]);
}

export async function deleteJob(id: string): Promise<void> {
  await query(`DELETE FROM jobs WHERE id = $1`, [id]);
}
