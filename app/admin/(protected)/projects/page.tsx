import Link from "next/link";
import { listProjects } from "@/lib/data/projects";
import { deleteProjectAction } from "./actions";

export default async function AdminProjectsPage() {
  const projects = await listProjects();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-copper">Projects</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
            Ventures
          </h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-ink hover:bg-copper-soft"
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-mist">No projects yet.</p>
      ) : (
        <ul className="divide-y hairline border-y hairline">
          {projects.map((p) => (
            <li key={p.id} className="flex items-center gap-4 py-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border hairline bg-ink-3">
                {p.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg text-paper">{p.name}</p>
                <p className="truncate text-xs text-faint">
                  {p.status} · {p.slug}
                </p>
              </div>
              <Link
                href={`/admin/projects/${p.id}/edit`}
                className="text-sm text-copper hover:text-copper-soft"
              >
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteProjectAction(p.id, p.imageUrl);
                }}
              >
                <button type="submit" className="text-sm text-red-400 hover:text-red-300">
                  Delete
                </button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
