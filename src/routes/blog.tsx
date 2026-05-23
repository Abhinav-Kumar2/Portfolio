import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { getAllPosts } from "@/lib/blog";
import { BlogCard } from "@/components/BlogCard";

export const Route = createFileRoute("/blog")({
  component: BlogIndex,
  head: () => ({
    meta: [
      { title: "Blog - Abhinav Kumar" },
      { name: "description", content: "Essays and technical notes on machine learning, interpretability, and software craft." },
      { property: "og:title", content: "Blog - Abhinav Kumar" },
      { property: "og:description", content: "Essays and technical notes on machine learning, interpretability, and software craft." },
    ],
  }),
});

function BlogIndex() {
  const posts = getAllPosts();
  const tags = useMemo(() => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(), [posts]);
  const [active, setActive] = useState<string | null>(null);

  const visible = active ? posts.filter((p) => p.tags.includes(active)) : posts;

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="animate-rise">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Blog</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Notes from the Underground</h1>
        {/* <p className="mt-3 text-muted-foreground">
          Long-form notes, half-finished thoughts, and the occasional careful argument.
        </p> */}
      </header>

      {tags.length > 0 && (
        <div className="mt-8 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActive(null)}
            className={`rounded-sm border px-2 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
              active === null
                ? "border-foreground/50 text-foreground"
                : "border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            all
          </button>
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setActive(t === active ? null : t)}
              className={`rounded-sm border px-2 py-1 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                active === t
                  ? "border-foreground/50 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      <div className="mt-6">
        {visible.map((p) => <BlogCard key={p.slug} post={p} />)}
        {visible.length === 0 && (
          <p className="py-16 text-sm text-muted-foreground">No posts yet.</p>
        )}
      </div>
    </div>
  );
}
