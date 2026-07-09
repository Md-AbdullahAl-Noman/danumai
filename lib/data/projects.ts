import { query } from "@/lib/db";

export type Project = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  features: string[];
  accent: string;
  imageUrl: string | null;
  sortOrder: number;
};

type ProjectRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  features: string[];
  accent: string;
  image_url: string | null;
  sort_order: number;
};

function mapRow(row: ProjectRow): Project {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    tagline: row.tagline,
    description: row.description,
    status: row.status,
    features: row.features ?? [],
    accent: row.accent,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
  };
}

export async function listProjects(): Promise<Project[]> {
  const res = await query<ProjectRow>(
    `SELECT * FROM projects ORDER BY sort_order ASC, created_at ASC`
  );
  return res.rows.map(mapRow);
}

export async function getProject(id: string): Promise<Project | null> {
  const res = await query<ProjectRow>(`SELECT * FROM projects WHERE id = $1`, [id]);
  return res.rows[0] ? mapRow(res.rows[0]) : null;
}

export type ProjectInput = {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  status: string;
  features: string[];
  accent: string;
  imageUrl: string | null;
  sortOrder: number;
};

export async function createProject(input: ProjectInput): Promise<Project> {
  const res = await query<ProjectRow>(
    `INSERT INTO projects (slug, name, tagline, description, status, features, accent, image_url, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [
      input.slug,
      input.name,
      input.tagline,
      input.description,
      input.status,
      JSON.stringify(input.features),
      input.accent,
      input.imageUrl,
      input.sortOrder,
    ]
  );
  return mapRow(res.rows[0]);
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  const res = await query<ProjectRow>(
    `UPDATE projects SET
       slug = $2, name = $3, tagline = $4, description = $5, status = $6,
       features = $7, accent = $8, image_url = $9, sort_order = $10, updated_at = now()
     WHERE id = $1
     RETURNING *`,
    [
      id,
      input.slug,
      input.name,
      input.tagline,
      input.description,
      input.status,
      JSON.stringify(input.features),
      input.accent,
      input.imageUrl,
      input.sortOrder,
    ]
  );
  return mapRow(res.rows[0]);
}

export async function deleteProject(id: string): Promise<void> {
  await query(`DELETE FROM projects WHERE id = $1`, [id]);
}
