import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import "katex/dist/katex.min.css";
import type { Components } from "react-markdown";

interface MarkdownProps {
  content: string;
  /** Map of relative paths (e.g. "cover.png" or "./cover.png") to resolved asset URLs. */
  images?: Record<string, string>;
}

export function Markdown({ content, images = {} }: MarkdownProps) {
  const resolveSrc = (src?: string) => {
    if (!src) return src;
    const cleaned = src.trim().replace(/^<|>$/g, "");
    if (/^(https?:|data:|\/)/.test(cleaned)) return cleaned;
    return images[cleaned] ?? images[cleaned.replace(/^\.\//, "")] ?? cleaned;
  };

  const components: Components = {
    img: ({ src, alt, title }) => {
      const resolved = resolveSrc(typeof src === "string" ? src : undefined);
      return (
        <figure className="mx-auto">
          <img src={resolved} alt={alt ?? ""} loading="lazy" />
          {title ? <figcaption>{title}</figcaption> : null}
        </figure>
      );
    },
    a: ({ href, children, ...rest }) => {
      const external = href && /^https?:/.test(href);
      return (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          {...rest}
        >
          {children}
        </a>
      );
    },
  };

  return (
    <div className="prose-noir">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeKatex, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
