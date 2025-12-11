"use client";

import Image from "next/image";
import ReactMarkdown from "react-markdown";

interface LessonContentXanoProps {
  content: string | null | undefined;
}

export function LessonContentXano({ content }: LessonContentXanoProps) {
  if (!content) {
    return null;
  }

  // Try to parse as JSON (for rich content)
  let parsedContent = content;
  try {
    const parsed = JSON.parse(content);
    // If it's a PortableText-like array, convert to markdown
    if (Array.isArray(parsed)) {
      parsedContent = portableTextToMarkdown(parsed);
    } else if (typeof parsed === "string") {
      parsedContent = parsed;
    }
  } catch {
    // Content is already a string (markdown or HTML)
    parsedContent = content;
  }

  // Check if content is HTML
  if (parsedContent.trim().startsWith("<")) {
    return (
      <div
        className="prose prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: parsedContent }}
      />
    );
  }

  // Render as markdown
  return (
    <div className="prose prose-invert max-w-none">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3 text-white">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-white">
              {children}
            </h3>
          ),
          p: ({ children }) => (
            <p className="text-zinc-300 leading-relaxed mb-4">{children}</p>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-violet-500 pl-4 my-4 italic text-zinc-400">
              {children}
            </blockquote>
          ),
          ul: ({ children }) => (
            <ul className="list-disc list-inside space-y-2 mb-4 text-zinc-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside space-y-2 mb-4 text-zinc-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li className="ml-2">{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ className, children }) => {
            const isBlock = className?.includes("language-");
            if (isBlock) {
              return (
                <pre className="bg-zinc-800 rounded-lg p-4 overflow-x-auto">
                  <code className="text-sm text-violet-300 font-mono">
                    {children}
                  </code>
                </pre>
              );
            }
            return (
              <code className="bg-zinc-800 px-1.5 py-0.5 rounded text-sm text-violet-300 font-mono">
                {children}
              </code>
            );
          },
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <figure className="my-6">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-zinc-900">
                <Image
                  src={typeof src === "string" ? src : ""}
                  alt={alt || "Lesson image"}
                  fill
                  className="object-contain"
                />
              </div>
              {alt && (
                <figcaption className="text-sm text-zinc-400 mt-2 text-center italic">
                  {alt}
                </figcaption>
              )}
            </figure>
          ),
        }}
      >
        {parsedContent}
      </ReactMarkdown>
    </div>
  );
}

// Helper function to convert PortableText-like structure to markdown
function portableTextToMarkdown(blocks: unknown[]): string {
  return blocks
    .map((block: unknown) => {
      const b = block as Record<string, unknown>;
      if (b._type === "block") {
        const style = b.style as string;
        const children = b.children as Array<Record<string, unknown>>;
        const text = children
          ?.map((child) => {
            let t = child.text as string || "";
            const marks = child.marks as string[] || [];
            if (marks.includes("strong")) t = `**${t}**`;
            if (marks.includes("em")) t = `*${t}*`;
            if (marks.includes("code")) t = `\`${t}\``;
            return t;
          })
          .join("");

        switch (style) {
          case "h1":
            return `# ${text}\n`;
          case "h2":
            return `## ${text}\n`;
          case "h3":
            return `### ${text}\n`;
          case "h4":
            return `#### ${text}\n`;
          case "blockquote":
            return `> ${text}\n`;
          default:
            return `${text}\n`;
        }
      }

      if (b._type === "image") {
        const asset = b.asset as Record<string, unknown>;
        const url = asset?.url as string || "";
        const alt = (b.alt as string) || "Image";
        return `![${alt}](${url})\n`;
      }

      return "";
    })
    .join("\n");
}
