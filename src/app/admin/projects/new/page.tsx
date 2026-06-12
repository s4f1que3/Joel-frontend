"use client";

import { useRouter } from "next/navigation";
import ProjectForm from "@/components/ProjectForm";
import { projectsAPI } from "@/lib/api";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    await projectsAPI.create(formData);
    router.push("/admin/projects");
    router.refresh();
  };

  return (
    <div className="p-10 max-w-3xl">
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-1.5 text-white/50 text-sm hover:text-flame transition-colors mb-8"
      >
        <ArrowLeft size={15} />
        Back to projects
      </Link>
      <h1 className="text-2xl font-semibold text-white mb-8">New project</h1>
      <ProjectForm onSubmit={handleSubmit} submitLabel="Publish project" />
    </div>
  );
}
