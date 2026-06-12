import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface Project {
  _id: string;
  title: string;
  description: string;
  tech_stack?: string;
  link: string;
  thumbnail?: { asset?: { url?: string } };
}

export default function ProjectCard({ project }: { project: Project }) {
  const excerpt =
    project.description?.length > 140
      ? project.description.substring(0, 140) + "…"
      : project.description;

  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-ink-light border border-white/10 rounded-2xl overflow-hidden hover:border-flame/40 transition-colors h-full flex flex-col"
    >
      {project.thumbnail?.asset?.url && (
        <div className="relative w-full aspect-[16/10]">
          <Image
            src={project.thumbnail.asset.url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 380px"
          />
        </div>
      )}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-white font-semibold text-base group-hover:text-flame transition-colors mb-2 leading-snug flex items-center gap-1.5">
          {project.title}
          <ArrowUpRight
            size={15}
            className="text-flame opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </h3>
        <p className="text-white/60 text-sm leading-relaxed flex-1 line-clamp-3">{excerpt}</p>
        {project.tech_stack && (
          <p className="text-flame text-xs font-medium uppercase tracking-wider mt-4">
            {project.tech_stack}
          </p>
        )}
      </div>
    </a>
  );
}
