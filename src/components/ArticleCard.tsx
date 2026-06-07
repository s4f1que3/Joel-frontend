import Link from "next/link";
import Image from "next/image";
import { Pin } from "lucide-react";

interface Article {
  _id: string;
  Title: string;
  content: string;
  slug?: { current: string };
  publishedAt?: string;
  pinned?: boolean;
  thumbnailUrl?: string;
}

export default function ArticleCard({ article }: { article: Article }) {
  const href = `/articles/${article.slug?.current || article._id}`;
  const excerpt =
    article.content?.length > 160
      ? article.content.substring(0, 160) + "…"
      : article.content;

  return (
    <Link href={href} className="block group">
      <div className="border border-border-color rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all duration-200 h-full flex flex-col">
        {article.thumbnailUrl && (
          <div className="relative w-full aspect-video shrink-0">
            <Image
              src={article.thumbnailUrl}
              alt={article.Title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        )}
        <div className="p-6 flex flex-col flex-1">
          {article.pinned && (
            <div className="flex items-center gap-1.5 mb-3">
              <Pin size={12} className="text-accent" />
              <span className="text-xs font-medium text-accent">Pinned</span>
            </div>
          )}
          <h3 className="text-text-primary font-semibold text-base group-hover:text-primary transition-colors mb-2 leading-snug">
            {article.Title}
          </h3>
          <p className="text-text-secondary text-sm leading-relaxed flex-1">{excerpt}</p>
          {article.publishedAt && (
            <p className="text-text-secondary text-xs mt-4">
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
