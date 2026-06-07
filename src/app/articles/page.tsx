export const dynamic = "force-dynamic";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleCard from "@/components/ArticleCard";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function getArticles() {
  const res = await fetch(`${API}/articles`, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  return res.json().catch(() => []);
}

async function getPinned() {
  const res = await fetch(`${API}/articles/pinned`, { next: { revalidate: 60 } });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

export default async function ArticlesPage() {
  const [articles, pinned] = await Promise.all([getArticles(), getPinned()]);
  const list = Array.isArray(articles) ? articles : [];

  const unpinned = list.filter(
    (a: { _id: string }) => !pinned || a._id !== pinned._id
  );

  return (
    <>
      <Navbar />
      <main className="pt-14">
        <div className="max-w-5xl mx-auto px-6 pt-20 pb-32">
          <h1 className="text-4xl font-bold text-text-primary tracking-tight mb-2">Articles</h1>
          <p className="text-text-secondary text-base mb-12">
            Thoughts, insights, and writing by Joel Richards.
          </p>

          {pinned && (
            <div className="mb-8">
              <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-3">
                Pinned
              </p>
              <ArticleCard article={pinned} />
            </div>
          )}

          {unpinned.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unpinned.map((article: { _id: string; Title: string; content: string; slug?: { current: string }; publishedAt?: string; pinned?: boolean }) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : (
            !pinned && (
              <p className="text-text-secondary text-sm">No articles published yet.</p>
            )
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
