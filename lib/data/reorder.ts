import { query } from "@/lib/db";

type Orderable = { id: string; sortOrder: number };

/** Move one row up or down within an ordered list by rewriting sort_order.
 *
 *  The list may start with duplicate/zero sort_order values (the table
 *  default), so rather than swap two values we compute the desired final order
 *  and renumber every row to a clean 1..N sequence in a single pass. Safe
 *  no-op at the ends. */
export async function reorderSwap(
  table: "projects" | "jobs",
  items: Orderable[],
  id: string,
  direction: "up" | "down"
): Promise<void> {
  const index = items.findIndex((it) => it.id === id);
  if (index === -1) return;
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= items.length) return;

  const ordered = [...items];
  [ordered[index], ordered[swapWith]] = [ordered[swapWith], ordered[index]];

  for (let i = 0; i < ordered.length; i++) {
    await query(
      `UPDATE ${table} SET sort_order = $2, updated_at = now() WHERE id = $1`,
      [ordered[i].id, i + 1]
    );
  }
}
