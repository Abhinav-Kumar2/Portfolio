import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import type { Components } from "react-markdown";

interface MarkdownProps {
  content: string;
  /** Map of relative paths (e.g. "cover.png" or "./cover.png") to resolved asset URLs. */
  images?: Record<string, string>;
}

export function Markdown({ content, images = {} }: MarkdownProps) {
  const resolveSrc = (src?: string) => {
    if (!src) return src;
    if (/^(https?:|data:|\/)/.test(src)) return src;
    return images[src] ?? images[src.replace(/^\.\//, "")] ?? src;
  };

  const components: Components = {
    img: ({ src, alt, title }) => {
      const resolved = resolveSrc(typeof src === "string" ? src : undefined);
      return (
        <figure>
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
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeHighlight, { detect: true, ignoreMissing: true }]]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
