# Personal Portfolio &amp; Technical Blog

A noir-style personal portfolio and blog. Built with TanStack Start (Vite + React + TypeScript + Tailwind v4). Markdown posts live next to their images. Deployable as a fully static site to GitHub Pages.

## Quick start

```bash
bun install        # or: npm install
bun run dev        # local dev server
bun run build      # production build
bun run preview    # serve the build
```

## Writing a post

Create a folder under `src/content/blogs/` and drop an `index.md` inside,
together with any images you reference.

```
src/content/blogs/
└── my-new-post/
    ├── index.md
    ├── cover.png
    └── diagram.png
```

Frontmatter:

```markdown
---
title: Title of the post
date: 2025-03-12
description: One-line description used in lists and meta tags.
tags: [transformers, notes]
cover: cover.png
---

# Heading

Body text. Reference images with relative paths:

![Diagram of the thing](./diagram.png "Optional caption")
```

Supported: GFM (tables, task lists, strikethrough), fenced code blocks with
syntax highlighting, blockquotes, inline code, footnotes, raw HTML.

## Projects

Edit `src/lib/projects.ts` — plain TypeScript array, no CMS.

## Site identity

Edit `src/lib/site.ts` for name, bio, social links, and Giscus configuration.

## Comments (Giscus)

1. Visit <https://giscus.app> and configure your repo.
2. Replace the placeholder values inside `site.giscus` in `src/lib/site.ts`.
3. Enable GitHub Discussions on the repository.

Comments will inherit the active theme automatically.

## GitHub Pages deployment

This template ships configured for the Cloudflare Workers runtime. To deploy
the **fully static** build to GitHub Pages:

1. Build the site: `bun run build` (this generates a static client bundle).
2. Push the `dist/` directory to the `gh-pages` branch, or use a GitHub Action.

Suggested workflow (`.github/workflows/deploy.yml`):

```yaml
name: Deploy
on:
  push: { branches: [main] }
permissions: { contents: write }
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install
      - run: bun run build
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/client
```

If your repo lives at `github.com/you/your-repo` (i.e. it&apos;s not a user-site),
set `base` in `vite.config.ts` to `'/your-repo/'` so asset paths resolve.

## Folder structure

```
src/
├── components/      # Header, Footer, ProjectCard, BlogCard, Markdown, Comments, ThemeToggle
├── content/
│   └── blogs/       # Each post = one folder with index.md + images
├── hooks/           # use-theme
├── lib/             # blog loader, projects data, site config
├── routes/          # TanStack file-based routes (index, projects, blog, blog.$slug)
└── styles.css       # Noir design system + prose styles + syntax themes
```
