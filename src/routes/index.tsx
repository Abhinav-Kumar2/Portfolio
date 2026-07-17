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
      { title: `${site.name} - ${site.role}` },
      { name: "description", content: site.bio },
    ],
  }),
});

function Index() {
  const featured = projects.slice(0, 3);
  const posts = getAllPosts().slice(0, 4);

  return (
    <div className="mx-auto max-w-5xl px-6">
      {/* About */}
      <section className="animate-rise pt-24 pb-20 sm:pt-32 sm:pb-12">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {site.role}
        </p>

        <h1 className="mt-5 max-w-3xl text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
          {site.name}.
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Undergraduate Student from Artificial Intelligence and Data Science branch in IIT Jodhpur. UG Researcher at Image Analysis and Biometric Lab(IAB) in IIT Jodhpur interested in building and understanding systems across AI and machine learning. 
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <a
            href={site.social.github}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Github className="h-4 w-4" /> GitHub
          </a>

          <a
            href={site.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Linkedin className="h-4 w-4" /> LinkedIn
          </a>

          <a
            href={site.social.twitter}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Twitter className="h-4 w-4" /> X
          </a>

          <a
            href={`mailto:${site.email}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
          >
            <Mail className="h-4 w-4" /> {site.email}
          </a>
        </div>
      </section>

      {/* Publications */}
      <section className="py-12">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-medium tracking-tight">
            Publications
          </h2>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <article className="group flex flex-col rounded-lg border border-border bg-surface/60 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-surface">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-medium tracking-tight text-foreground">
                  Spashta Audio-Bench: Unified ASR & TTS Evaluation Framework across Indian Languages
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">Accepted at Interspeech 2026 (CORE A-ranked)</p>
              </div>
              <span className="font-mono text-xs text-muted-foreground">Jun 2026</span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              Advisors: Dr. Richa Singh and Dr. Mayank Vatsa.
            </p>

            <div className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>
                Quantified the performance of 10 open-source ASR and TTS models across 7 corpora spanning 22 Indian languages, analyzing 329K+ samples totaling 644+ hours of speech.
              </p>
              <p>
                Formulated TTS-ASR degradation as a novel, reproducible intelligibility metric, enabling joint evaluation of acoustic naturalness and linguistic fidelity.
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Featured projects */}
      <section className="py-12">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-medium tracking-tight">
            Selected work
          </h2>

          <Link
            to="/projects"
            className="group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            All projects{" "}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* Latest blogs */}
      <section className="py-12">
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-medium tracking-tight">
            Recent Blogs
          </h2>

          <Link
            to="/blog"
            className="group inline-flex items-center gap-1 font-mono text-xs uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
          >
            Archive{" "}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-4">
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}

          {posts.length === 0 && (
            <p className="py-8 text-sm text-muted-foreground">
              No posts yet - add a markdown file under{" "}
              <code className="font-mono">
                src/content/blogs/
              </code>.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}