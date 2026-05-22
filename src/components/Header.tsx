import { Link } from "@tanstack/react-router";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/lib/site";

const nav = [
  { to: "/", label: "Index" },
  { to: "/projects", label: "Projects" },
  { to: "/blog", label: "Writing" },
] as const;

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/65">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-mono text-sm tracking-tight text-foreground">
          {site.name.toLowerCase().replace(/\s+/g, ".")}
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              activeProps={{ className: "text-foreground" }}
              inactiveProps={{ className: "text-muted-foreground" }}
              className="rounded-md px-3 py-1.5 text-sm transition-colors hover:text-foreground"
            >
              {n.label}
            </Link>
          ))}
          <span className="ml-2"><ThemeToggle /></span>
        </nav>
      </div>
    </header>
  );
}
