"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Pencil, ExternalLink } from "lucide-react";
import { projectsAPI } from "@/lib/api";

interface ProjectItem {
  _id: string;
  title: string;
  description?: string;
  tech_stack?: string;
  link: string;
  thumbnail?: { asset?: { url?: string } };
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const all = await projectsAPI.getAll();
      setProjects(Array.isArray(all) ? all : []);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (project: ProjectItem) => {
    if (!confirm("Delete this project?")) return;
    try {
      await projectsAPI.delete(project._id);
      load();
    } catch {
      alert("Failed to delete project");
    }
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center gap-2 text-white/50 text-sm">
        <div className="w-4 h-4 rounded-full border-2 border-flame border-t-transparent animate-spin" />
        Loading…
      </div>
    );
  }

  return (
    <div className="p-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white mb-1">Projects</h1>
          <p className="text-white/50 text-sm">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 bg-flame text-ink px-4 py-2 rounded-full text-sm font-semibold hover:bg-flame-dark transition-colors"
        >
          <Plus size={15} />
          New project
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {projects.length === 0 ? (
        <div className="border border-dashed border-white/15 rounded-2xl p-12 text-center">
          <p className="text-white/50 text-sm mb-4">No projects yet.</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-flame text-ink px-4 py-2 rounded-full text-sm font-semibold hover:bg-flame-dark transition-colors"
          >
            <Plus size={15} />
            Add your first project
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project._id}
              className="border border-white/10 bg-ink-light rounded-2xl px-6 py-4 flex items-center justify-between gap-4"
            >
              {project.thumbnail?.asset?.url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={project.thumbnail.asset.url}
                  alt=""
                  className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white/10"
                />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate mb-0.5">
                  {project.title}
                </h3>
                {project.description && (
                  <p className="text-white/50 text-xs truncate">
                    {project.description.substring(0, 80)}…
                  </p>
                )}
                {project.tech_stack && (
                  <p className="text-flame text-xs font-medium uppercase tracking-wider mt-1">
                    {project.tech_stack}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <ExternalLink size={15} />
                </a>
                <Link
                  href={`/admin/projects/${project._id}/edit`}
                  className="p-2 rounded-lg text-white/50 hover:text-flame hover:bg-flame/10 transition-colors"
                >
                  <Pencil size={15} />
                </Link>
                <button
                  onClick={() => handleDelete(project)}
                  className="p-2 rounded-lg text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
