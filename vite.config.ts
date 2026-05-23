import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// GitHub Pages deployment:
// - Cloudflare Workers output is disabled (`cloudflare: false`) so `vite build`
//   produces plain static files instead of a Worker bundle.
// - TanStack Start runs in SPA mode and prerenders every crawlable route into
//   standalone HTML files. Direct loads of /blog, /blog/<slug>, etc. work
//   without a server.
// - `base` is read from VITE_BASE_PATH at build time. The GitHub Actions
//   workflow sets it to `/<repo>/` for project pages, or `/` for user/org
//   pages and custom domains.
// - Client output is written directly to `dist/` so the workflow can upload
//   it as the Pages artifact without an extra `dist/client` hop.

const basePath = process.env.VITE_BASE_PATH ?? "/";

export default defineConfig({
  cloudflare: false,
  tanstackStart: {
    spa: {
      enabled: true,
      prerender: {
        enabled: true,
        crawlLinks: true,
      },
    },
  },
  vite: {
    base: basePath,
    build: {
      outDir: "dist",
    },
    environments: {
      client: {
        build: {
          outDir: "dist",
        },
      },
    },
  },
});
