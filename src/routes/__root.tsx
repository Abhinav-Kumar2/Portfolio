import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

function NotFoundComponent() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">404</p>
      <h1 className="mt-4 text-2xl font-medium tracking-tight">Lost in the dark.</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        The page you're looking for has slipped past the frame.
      </p>
      <a
        href="/"
        className="mt-8 inline-block rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-foreground/40"
      >
        Back to the index
      </a>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="mx-auto max-w-2xl px-6 py-32 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Error</p>
      <h1 className="mt-4 text-2xl font-medium tracking-tight">Something broke quietly.</h1>
      <div className="mt-8 flex justify-center gap-2">
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-foreground/40"
        >
          Try again
        </button>
        <a href="/" className="rounded-md border border-border px-4 py-2 text-sm transition-colors hover:border-foreground/40">
          Home
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Adrian Vale — Research Engineer" },
      { name: "description", content: "Notes, projects and writing on machine learning, interpretability, and software craft." },
      { property: "og:title", content: "Adrian Vale — Research Engineer" },
      { property: "og:description", content: "Notes, projects and writing on machine learning, interpretability, and software craft." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('theme');var m=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=t?t==='dark':m;if(d)document.documentElement.classList.add('dark');document.documentElement.style.colorScheme=d?'dark':'light';}catch(e){}})();`,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
