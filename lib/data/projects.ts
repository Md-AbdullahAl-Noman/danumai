import { query } from "@/lib/db";
import { reorderSwap } from "./reorder";

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
  published: boolean;
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
  published: boolean;
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
    published: row.published,
    sortOrder: row.sort_order,
  };
}

export async function listProjects(opts: { publishedOnly?: boolean } = {}): Promise<Project[]> {
  const res = opts.publishedOnly
    ? await query<ProjectRow>(
        `SELECT * FROM projects WHERE published = true ORDER BY sort_order ASC, created_at ASC`
      )
    : await query<ProjectRow>(`SELECT * FROM projects ORDER BY sort_order ASC, created_at ASC`);
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
  published: boolean;
  sortOrder: number;
};

export async function createProject(input: ProjectInput): Promise<Project> {
  const res = await query<ProjectRow>(
    `INSERT INTO projects (slug, name, tagline, description, status, features, accent, image_url, published, sort_order)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
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
      input.published,
      input.sortOrder,
    ]
  );
  return mapRow(res.rows[0]);
}

export async function updateProject(id: string, input: ProjectInput): Promise<Project> {
  const res = await query<ProjectRow>(
    `UPDATE projects SET
       slug = $2, name = $3, tagline = $4, description = $5, status = $6,
       features = $7, accent = $8, image_url = $9, published = $10, sort_order = $11, updated_at = now()
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
      input.published,
      input.sortOrder,
    ]
  );
  return mapRow(res.rows[0]);
}

export async function deleteProject(id: string): Promise<void> {
  await query(`DELETE FROM projects WHERE id = $1`, [id]);
}

export async function setProjectPublished(id: string, published: boolean): Promise<void> {
  await query(
    `UPDATE projects SET published = $2, updated_at = now() WHERE id = $1`,
    [id, published]
  );
}

/** Quick inline edit of the fields shown on the list row. */
export async function quickUpdateProject(
  id: string,
  fields: { name: string; status: string; sortOrder: number }
): Promise<void> {
  await query(
    `UPDATE projects SET name = $2, status = $3, sort_order = $4, updated_at = now() WHERE id = $1`,
    [id, fields.name, fields.status, fields.sortOrder]
  );
}

/** Swap a project's sort_order with its neighbour in the given direction,
 *  so up/down buttons reorder the list. */
export async function moveProject(id: string, direction: "up" | "down"): Promise<void> {
  const all = await listProjects();
  await reorderSwap("projects", all, id, direction);
}
