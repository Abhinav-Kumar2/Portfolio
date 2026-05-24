import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getPost } from "@/lib/blog";
import { Markdown } from "@/components/Markdown";
import { Comments } from "@/components/Comments";

export const Route = createFileRoute("/blog_/$slug")({
  component: PostPage,
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) return {};
    return {
      meta: [
        { title: `${post.title} - Abhinav Kumar` },
        { name: "description", content: post.description },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        ...(post.cover ? [{ property: "og:image", content: post.cover }] : []),
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="mt-4 text-2xl font-medium">Post not found.</h1>
      <Link to="/blog" className="mt-8 inline-block text-sm text-muted-foreground hover:text-foreground">
        ← Back to Blog
      </Link>
    </div>
  ),
});

function PostPage() {
  const { post } = Route.useLoaderData();

  return (
    <article className="mx-auto max-w-[900px] px-6 py-16">
      <Link
        to="/blog"
        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Blog
      </Link>

      <header className="mt-8 border-b border-border/60 pb-10">
        <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
          <time>{post.date}</time>
          <span>·</span>
          <span className="rounded-full border border-border/70 bg-muted/10 px-2 py-0.5 font-semibold text-foreground">
            {post.readingTime} min read
          </span>
          {post.tags.map((t: string) => (
            <span key={t} className="uppercase tracking-wider">· {t}</span>
          ))}
        </div>
        <h1 className="mt-4 text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        {post.description && (
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{post.description}</p>
        )}
        {post.cover && (
          <img src={post.cover} alt="" className="mt-8 w-full rounded-lg border border-border" />
        )}
      </header>

      <div className="mt-10">
        <Markdown content={post.content} images={post.images} />
      </div>

      <Comments term={post.slug} />
    </article>
  );
}
