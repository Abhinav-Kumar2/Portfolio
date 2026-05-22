import { Link } from "@tanstack/react-router";
import type { BlogMeta } from "@/lib/blog";

export function BlogCard({ post }: { post: BlogMeta }) {
  return (
    <Link
      to="/blog/$slug"
      params={{ slug: post.slug }}
      className="group block border-b border-border/60 py-6 transition-colors hover:border-foreground/40"
    >
      <div className="flex items-baseline justify-between gap-4 font-mono text-xs text-muted-foreground">
        <time>{post.date}</time>
        <span>{post.readingTime} min</span>
      </div>
      <h3 className="mt-2 text-lg font-medium tracking-tight text-foreground transition-colors group-hover:text-foreground">
        {post.title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{post.description}</p>
      {post.tags.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {post.tags.map((t) => (
            <span key={t} className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
              · {t}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}
