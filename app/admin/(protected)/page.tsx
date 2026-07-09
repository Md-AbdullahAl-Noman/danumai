import Link from "next/link";
import { listProjects } from "@/lib/data/projects";
import { listJobs } from "@/lib/data/jobs";

export default async function AdminDashboard() {
  const [projects, jobs] = await Promise.all([listProjects(), listJobs()]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-copper">Overview</p>
        <h1 className="mt-2 font-display text-3xl tracking-tight text-paper">
          Dashboard
        </h1>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">
        <Link href="/admin/projects" className="card card-hover p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-faint">Projects</p>
          <p className="mt-2 font-display text-3xl text-paper">{projects.length}</p>
          <p className="mt-3 text-sm text-mist">
            Manage ventures shown on the homepage.
          </p>
        </Link>
        <Link href="/admin/jobs" className="card card-hover p-6">
          <p className="text-xs uppercase tracking-[0.2em] text-faint">Jobs</p>
          <p className="mt-2 font-display text-3xl text-paper">{jobs.length}</p>
          <p className="mt-3 text-sm text-mist">
            Manage open roles shown on the careers page.
          </p>
        </Link>
      </div>
    </div>
  );
}
