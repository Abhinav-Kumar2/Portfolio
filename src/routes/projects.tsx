import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { projects } from "@/lib/projects";
import { ProjectCard } from "@/components/ProjectCard";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projects — Adrian Vale" },
      { name: "description", content: "Selected research and engineering projects." },
      { property: "og:title", content: "Projects — Adrian Vale" },
      { property: "og:description", content: "Selected research and engineering projects." },
    ],
  }),
});

function ProjectsPage() {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState<string>("all");
  const [year, setYear] = useState<string>("all");

  const tags = useMemo(() => Array.from(new Set(projects.flatMap((p) => p.tags))).sort(), []);
  const years = useMemo(
    () => Array.from(new Set(projects.map((p) => p.year))).sort((a, b) => b - a),
    []
  );

  const filtered = projects.filter((p) => {
    if (tag !== "all" && !p.tags.includes(tag)) return false;
    if (year !== "all" && String(p.year) !== year) return false;
    if (q) {
      const hay = `${p.title} ${p.description} ${p.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <header className="animate-rise">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Projects</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Things I&apos;ve built.</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Research prototypes, libraries, and the occasional weekend experiment.
        </p>
      </header>

      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects…"
            className="h-10 w-full rounded-md border border-border bg-surface pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:border-foreground/40 focus:outline-none"
          />
        </div>
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm focus:border-foreground/40 focus:outline-none"
        >
          <option value="all">All tags</option>
          {tags.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="h-10 rounded-md border border-border bg-surface px-3 text-sm focus:border-foreground/40 focus:outline-none"
        >
          <option value="all">All years</option>
          {years.map((y) => <option key={y} value={String(y)}>{y}</option>)}
        </select>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => <ProjectCard key={p.slug} project={p} />)}
      </div>
      {filtered.length === 0 && (
        <p className="py-16 text-center text-sm text-muted-foreground">No projects match those filters.</p>
      )}
    </div>
  );
}
