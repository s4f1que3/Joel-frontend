export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ArticleImage {
  asset?: { url?: string };
  caption?: string;
  alt?: string;
}

interface ArticleFile {
  asset?: { url?: string; originalFilename?: string };
}

interface Article {
  _id: string;
  Title: string;
  content: string;
  publishedAt?: string;
  images?: ArticleImage[];
  Files?: ArticleFile[];
}

async function getArticle(slug: string): Promise<Article | null> {
  const res = await fetch(`${API}/articles/${slug}`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticle(slug);
  if (!article) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <article className="max-w-2xl mx-auto px-6 pt-20 pb-32">
          <Link
            href="/articles"
            className="inline-flex items-center gap-1.5 text-text-secondary text-sm hover:text-primary transition-colors mb-10"
          >
            <ArrowLeft size={15} />
            All articles
          </Link>

          <header className="mb-10">
            <h1 className="text-4xl font-bold text-text-primary tracking-tight leading-tight mb-4">
              {article.Title}
            </h1>
            {article.publishedAt && (
              <p className="text-text-secondary text-sm">
                {new Date(article.publishedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </header>

          <div className="prose prose-sm max-w-none text-text-primary leading-relaxed whitespace-pre-wrap text-base">
            {article.content}
          </div>

          {article.images && article.images.length > 0 && (
            <div className="mt-12 space-y-4">
              <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                Images
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {article.images.map((img, i) =>
                  img.asset?.url ? (
                    <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-surface">
                      <Image
                        src={img.asset.url}
                        alt={img.alt || img.caption || "Article image"}
                        fill
                        className="object-cover"
                      />
                      {img.caption && (
                        <p className="absolute bottom-0 left-0 right-0 bg-black/40 text-white text-xs px-2 py-1">
                          {img.caption}
                        </p>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          )}

          {article.Files && article.Files.length > 0 && (
            <div className="mt-10 space-y-3">
              <h2 className="text-sm font-medium text-text-secondary uppercase tracking-wide">
                Attachments
              </h2>
              {article.Files.map((f, i) =>
                f.asset?.url ? (
                  <a
                    key={i}
                    href={f.asset.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 border border-border-color rounded-xl px-4 py-3 hover:border-primary hover:text-primary text-text-secondary text-sm transition-colors"
                  >
                    <FileDown size={16} />
                    {f.asset.originalFilename || `File ${i + 1}`}
                  </a>
                ) : null
              )}
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
