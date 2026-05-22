// Markdown blog loader. Posts live in src/content/blogs/<slug>/index.md
// with co-located images. Frontmatter is parsed in-browser (no Node deps).

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  cover?: string;
  readingTime: number;
}

export interface BlogPost extends BlogMeta {
  content: string;
  images: Record<string, string>;
}

// Eager raw markdown
const rawPosts = import.meta.glob("../content/blogs/*/index.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

// Eager image URL map (resolved by Vite to hashed asset URLs)
const imageUrls = import.meta.glob(
  "../content/blogs/**/*.{png,jpg,jpeg,gif,webp,svg,avif}",
  { eager: true, query: "?url", import: "default" }
) as Record<string, string>;

function parseFrontmatter(raw: string): { data: Record<string, unknown>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };
  const data: Record<string, unknown> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val: unknown = m[2].trim();
    const s = val as string;
    if (s.startsWith("[") && s.endsWith("]")) {
      val = s
        .slice(1, -1)
        .split(",")
        .map((x) => x.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      val = s.replace(/^["']|["']$/g, "");
    }
    data[key] = val;
  }
  return { data, content: match[2] };
}

function slugFromPath(path: string): string {
  const m = path.match(/blogs\/([^/]+)\/index\.md$/);
  return m ? m[1] : path;
}

function buildImageMapForSlug(slug: string): Record<string, string> {
  const prefix = `../content/blogs/${slug}/`;
  const out: Record<string, string> = {};
  for (const [path, url] of Object.entries(imageUrls)) {
    if (path.startsWith(prefix)) {
      const rel = path.slice(prefix.length);
      out[rel] = url;
      out[`./${rel}`] = url;
    }
  }
  return out;
}

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}

function buildPost(path: string, raw: string): BlogPost {
  const slug = slugFromPath(path);
  const { data, content } = parseFrontmatter(raw);
  const images = buildImageMapForSlug(slug);
  const cover = typeof data.cover === "string" ? images[data.cover] ?? data.cover : undefined;
  return {
    slug,
    title: (data.title as string) ?? slug,
    date: (data.date as string) ?? "",
    description: (data.description as string) ?? "",
    tags: Array.isArray(data.tags) ? (data.tags as string[]) : [],
    cover,
    readingTime: estimateReadingTime(content),
    content,
    images,
  };
}

export function getAllPosts(): BlogPost[] {
  return Object.entries(rawPosts)
    .map(([p, r]) => buildPost(p, r))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPost(slug: string): BlogPost | undefined {
  const entry = Object.entries(rawPosts).find(([p]) => slugFromPath(p) === slug);
  return entry ? buildPost(entry[0], entry[1]) : undefined;
}

export function getAllSlugs(): string[] {
  return Object.keys(rawPosts).map(slugFromPath);
}
