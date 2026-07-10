import { query } from "@/lib/db";
import {
  DEFAULT_CONTENT,
  SECTIONS,
  coerceSection,
  type SectionKey,
  type SiteContent,
} from "@/lib/content";

type ContentRow = { key: string; value: unknown };

/** The whole site's editable content, with every section falling back to its
 *  built-in default whenever the database has no (or invalid) override. Never
 *  throws for content reasons — callers can still choose to catch DB errors. */
export async function getSiteContent(): Promise<SiteContent> {
  const res = await query<ContentRow>(`SELECT key, value FROM site_content`);
  const overrides = new Map(res.rows.map((r) => [r.key, r.value]));

  const out: Record<string, unknown> = {};
  for (const section of SECTIONS) {
    const key = section.key;
    out[key] = overrides.has(key)
      ? coerceSection(key, overrides.get(key))
      : DEFAULT_CONTENT[key];
  }
  return out as SiteContent;
}

/** Content for a single section. Cheap enough for a per-component fetch. */
export async function getSection<K extends SectionKey>(
  key: K
): Promise<SiteContent[K]> {
  const res = await query<ContentRow>(
    `SELECT value FROM site_content WHERE key = $1`,
    [key]
  );
  return res.rows[0]
    ? coerceSection(key, res.rows[0].value)
    : DEFAULT_CONTENT[key];
}

/** Upsert one section's content. The value is coerced against the schema first,
 *  so only well-formed data is ever persisted. */
export async function updateSection<K extends SectionKey>(
  key: K,
  raw: unknown
): Promise<void> {
  const value = coerceSection(key, raw);
  await query(
    `INSERT INTO site_content (key, value, updated_at)
     VALUES ($1, $2, now())
     ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()`,
    [key, JSON.stringify(value)]
  );
}
