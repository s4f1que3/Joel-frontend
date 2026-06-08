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

  if (article.thumbnailUrl) {
    return (
      <Link href={href} className="block group">
        <div className="border border-border-color rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all duration-200 flex flex-row h-44 sm:h-48">
          <div className="relative w-2/5 shrink-0">
            <Image
              src={article.thumbnailUrl}
              alt={article.Title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 40vw, 220px"
            />
          </div>
          <div className="px-5 py-4 sm:px-6 sm:py-5 flex flex-col flex-1 min-w-0 justify-between overflow-hidden">
            <div>
              {article.pinned && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Pin size={12} className="text-accent" />
                  <span className="text-xs font-medium text-accent">Pinned</span>
                </div>
              )}
              <h3 className="text-text-primary font-bold text-lg sm:text-xl group-hover:text-primary transition-colors mb-2 leading-snug line-clamp-2 sm:line-clamp-3">
                {article.Title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed line-clamp-2">{excerpt}</p>
            </div>
            {article.publishedAt && (
              <p className="text-text-secondary text-xs shrink-0">
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

  return (
    <Link href={href} className="block group">
      <div className="border border-border-color rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all duration-200 h-full flex flex-col">
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
