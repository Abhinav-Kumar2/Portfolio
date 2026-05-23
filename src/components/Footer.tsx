import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-3 px-6 py-8 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p className="font-mono">© {new Date().getFullYear()} {site.name}.</p>
        {/* <p className="font-mono">built with restraint · vite · react · tanstack</p> */}
      </div>
    </footer>
  );
}
