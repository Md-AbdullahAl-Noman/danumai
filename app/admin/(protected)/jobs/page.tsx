import Link from "next/link";
import { listJobs } from "@/lib/data/jobs";
import { deleteJobAction } from "./actions";

export default async function AdminJobsPage() {
  const jobs = await listJobs();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-copper">Jobs</p>
          <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
            Open roles
          </h1>
        </div>
        <Link
          href="/admin/jobs/new"
          className="rounded-full bg-copper px-5 py-2.5 text-sm font-medium text-ink hover:bg-copper-soft"
        >
          New job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <p className="text-sm text-mist">No jobs yet.</p>
      ) : (
        <ul className="divide-y hairline border-y hairline">
          {jobs.map((j) => (
            <li key={j.id} className="flex items-center gap-4 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-lg text-paper">
                  {j.title}
                  {!j.published && (
                    <span className="ml-2 rounded-full border hairline px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-faint">
                      Draft
                    </span>
                  )}
                </p>
                <p className="truncate text-xs text-faint">
                  {j.team} · {j.location} · {j.type}
                </p>
              </div>
              <Link
                href={`/admin/jobs/${j.id}/edit`}
                className="text-sm text-copper hover:text-copper-soft"
              >
                Edit
              </Link>
              <form
                action={async () => {
                  "use server";
                  await deleteJobAction(j.id);
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
