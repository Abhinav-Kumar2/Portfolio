import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col rounded-lg border border-border bg-surface/60 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-surface">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-medium tracking-tight text-foreground">{project.title}</h3>
        <span className="font-mono text-xs text-muted-foreground">{project.year}</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tags.map((t) => (
          <span key={t} className="rounded-sm border border-border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center gap-4 text-xs text-muted-foreground">
        {project.github && (
          <a href={project.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <Github className="h-3.5 w-3.5" /> source
          </a>
        )}
        {project.demo && (
          <a href={project.demo} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground">
            <ExternalLink className="h-3.5 w-3.5" /> demo
          </a>
        )}
      </div>
    </article>
  );
}
