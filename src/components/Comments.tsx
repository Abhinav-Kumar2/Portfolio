import Giscus from "@giscus/react";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";

/**
 * Giscus comments.
 *
 * Setup:
 *   1. Visit https://giscus.app and configure your repository.
 *   2. Update `site.giscus` in src/lib/site.ts with `repo`, `repoId`,
 *      `category`, and `categoryId` from the generated snippet.
 *   3. Enable GitHub Discussions for the repository.
 */
export function Comments({ term }: { term: string }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const read = () =>
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);

  if (site.giscus.repoId.startsWith("REPLACE_")) {
    return (
      <div className="mt-16 rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground">
        <p className="font-mono text-xs uppercase tracking-wider text-foreground">Comments</p>
        <p className="mt-2">
          Configure Giscus in <code className="font-mono">src/lib/site.ts</code> to enable comments.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-16">
      <Giscus
        id="comments"
        repo={site.giscus.repo}
        repoId={site.giscus.repoId}
        category={site.giscus.category}
        categoryId={site.giscus.categoryId}
        mapping={site.giscus.mapping}
        term={term}
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme={theme === "dark" ? "noborder_dark" : "noborder_light"}
        lang="en"
        loading="lazy"
      />
    </div>
  );
}
