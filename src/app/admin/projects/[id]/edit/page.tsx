"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { projectsAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description?: string;
  tech_stack?: string;
  link: string;
  thumbnail?: { asset?: { url?: string } };
}

export default function EditProjectPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI
      .getAll()
      .then((all) => {
        const found = Array.isArray(all) ? all.find((p: Project) => p._id === id) : null;
        if (!found) {
          router.push("/admin/projects");
          return;
        }
        setProject(found);
      })
      .catch(() => router.push("/admin/projects"))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleSubmit = async (formData: FormData) => {
    const editData = new FormData();
    editData.append("new_title", formData.get("title") as string);
    editData.append("new_description", formData.get("description") as string);
    editData.append("new_tech_stack", formData.get("tech_stack") as string);
    editData.append("new_link", formData.get("link") as string);
    const thumbnail = formData.get("thumbnail");
    if (thumbnail instanceof File) editData.append("thumbnail", thumbnail);
    const removeThumbnail = formData.get("remove_thumbnail");
    if (removeThumbnail) editData.append("remove_thumbnail", removeThumbnail as string);
    await projectsAPI.update(id, editData);
    router.push("/admin/projects");
  };

  if (loading) {
    return (
      <div className="p-10 flex items-center gap-2 text-white/50 text-sm">
        <div className="w-4 h-4 rounded-full border-2 border-flame border-t-transparent animate-spin" />
        Loading…
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="p-10 max-w-3xl">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-white/50 text-sm hover:text-flame transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Back to projects
      </Link>
      <h1 className="text-2xl font-semibold text-white mb-8">Edit project</h1>
      <ProjectForm
        initialData={{
          title: project.title,
          description: project.description,
          tech_stack: project.tech_stack,
          link: project.link,
          thumbnailUrl: project.thumbnail?.asset?.url,
        }}
        onSubmit={handleSubmit}
        submitLabel="Save changes"
      />
    </div>
  );
}
