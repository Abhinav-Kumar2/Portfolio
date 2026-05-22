import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { site } from "@/lib/site";
import { projects } from "@/lib/projects";
import { getAllPosts } from "@/lib/blog";
import { ProjectCard } from "@/components/ProjectCard";
import { BlogCard } from "@/components/BlogCard";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: `${site.name} — ${site.role}` },
      { name: "description", content: site.bio },
    ],
  }),
});

function Index() {
  const featured = projects.slice(0, 3);
  const posts = getAllPosts().slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* Hero */}
      <section className="animate-rise pt-24 pb-20 sm:pt-32 sm:pb-28">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {site.role}
        </p>
        <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          {site.name}.
          <span className="block text-muted-foreground">Notes from the dark room.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          {site.bio}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <a href={site.social.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Github className="h-4 w-4" /> GitHub
          </a>
          <a href={site.social.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>
          <a href={site.social.twitter} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Twitter className="h-4 w-4" /> X
          </a>
          <a href={`mailto:${site.email}`} className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Mail className="h-4 w-4" /> {site.email}
          </a>
        </div>
      </section>

      <hr className="border-border/60" />

      {/* Featured projects */}
      <section className="py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-medium tracking-tight">Selected work</h2>
          <Link to="/projects" className="group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
            All projects <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => <ProjectCard key={p.slug} project={p} />)}
        </div>
      </section>

      <hr className="border-border/60" />

      {/* Latest writing */}
      <section className="py-16">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-medium tracking-tight">Recent writing</h2>
          <Link to="/blog" className="group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground">
            Archive <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        <div className="mt-4">
          {posts.map((p) => <BlogCard key={p.slug} post={p} />)}
          {posts.length === 0 && (
            <p className="py-8 text-sm text-muted-foreground">No posts yet — add a markdown file under <code className="font-mono">src/content/blogs/</code>.</p>
          )}
        </div>
      </section>

      <hr className="border-border/60" />

      {/* Skills */}
      <section className="py-16">
        <h2 className="text-xl font-medium tracking-tight">Tools &amp; interests</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {site.skills.map((s) => (
            <span key={s} className="rounded-sm border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted-foreground">
              {s}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
