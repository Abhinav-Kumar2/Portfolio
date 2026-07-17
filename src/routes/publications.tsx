import { createFileRoute } from "@tanstack/react-router";
import { site } from "@/lib/site";

export const Route = createFileRoute("/publications")({
  component: PublicationsPage,
  head: () => ({
    meta: [
      { title: "Publications - Abhinav Kumar" },
      { name: "description", content: "A list of publications and research contributions." },
      { property: "og:title", content: "Publications - Abhinav Kumar" },
      { property: "og:description", content: "A list of publications and research contributions." },
    ],
  }),
});

function PublicationsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <header className="animate-rise">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Publications</p>
        <h1 className="mt-3 text-3xl font-medium tracking-tight sm:text-4xl">Research contributions</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Selected publications and accepted conference papers from my research work.
        </p>
      </header>

      <section className="mt-12">
        <article className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-surface/70 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-foreground/30 hover:bg-surface md:flex-row md:items-stretch">
          <div className="flex-1 p-6 md:p-8">
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-3">
                <div className="min-w-0">
                  <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                    Spashta Audio-Bench: Unified ASR & TTS Evaluation Framework across Indian Languages
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                    Accepted at Interspeech 2026 (CORE A-ranked) · Jun 2026
                  </p>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                Advisors: Dr. Richa Singh and Dr. Mayank Vatsa.
              </p>
            </div>
          </div>

          <div className="border-t border-border/60 bg-background/80 p-6 md:w-[44%] md:min-w-[320px] md:border-t-0 md:border-l md:border-border/60 md:p-8">
            <p className="font-medium text-foreground">Highlights</p>
            <ul className="mt-4 space-y-3 pl-5 text-sm leading-relaxed marker:text-foreground sm:text-base">
              <li>
                Quantified performance of 10 open-source ASR and TTS models across 7 corpora spanning 22 Indian languages.
              </li>
              <li>
                Analyzed 329K+ samples totaling 644+ hours of speech.
              </li>
              <li>
                Introduced a reproducible intelligibility metric for joint TTS-ASR evaluation.
              </li>
            </ul>
          </div>
        </article>
      </section>
    </div>
  );
}
