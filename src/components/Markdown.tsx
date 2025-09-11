"use client";

interface MarkdownParserProps {
  content: string;
}

type CodeBlock = { lang?: string; code: string };

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const sanitizeUrl = (input: string): string => {
  if (!input) return "#";
  const raw = input.trim().replace(/[\n\r\t]/g, "");
  if (raw.startsWith("#") || raw.startsWith("/")) return raw;
  if (raw.startsWith("//")) return "https:" + raw;

  try {
    const parsed = new URL(raw);
    const proto = parsed.protocol.toLowerCase();
    if (proto === "http:" || proto === "https:") {
      parsed.username = "";
      parsed.password = "";
      return parsed.href;
    }
  } catch {
    // unsafe
  }
  return "#";
};

export default function MarkdownParser({ content }: MarkdownParserProps) {
  const parseMarkdown = (text: string): string => {
    if (!text) return "";

    let src = text.replace(/\r\n/g, "\n");

    // 1) Extract code blocks
    const codeBlocks: CodeBlock[] = [];
    src = src.replace(/```(\w+)?\n([\s\S]*?)```/g, (_m, lang, code) => {
      const id = codeBlocks.length;
      codeBlocks.push({ lang, code });
      return `@@CODEBLOCK_${id}@@`;
    });

    // 2) Escape all other HTML
    src = escapeHtml(src);

    // 3) Restore code blocks safely
    const renderCodeBlock = (id: number) => {
      const cb = codeBlocks[id];
      const langAttr = cb.lang ? ` data-language="${escapeHtml(cb.lang)}"` : "";
      return `<pre class="w-full max-w-full bg-muted rounded-lg p-4 overflow-x-scroll my-4"><code${langAttr} class="font-mono text-sm">${escapeHtml(
        cb.code.trim(),
      )}</code></pre>`;
    };

    // replace placeholders with actual code blocks
    src = src.replace(/@@CODEBLOCK_(\d+)@@/g, (_m, id) =>
      renderCodeBlock(Number(id)),
    );

    // 4) Inline parsing (bold, italics, links, inline code, etc.)
    const parseInline = (s: string) => {
      if (!s) return "";

      // inline code first
      s = s.replace(/`([^`]+)`/g, (_m, code) => {
        return `<code class="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">${code}</code>`;
      });

      // links
      s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, url) => {
        return `<a href="${sanitizeUrl(
          url,
        )}" class="text-primary underline hover:no-underline" target="_blank" rel="noopener noreferrer">${text}</a>`;
      });

      // strikethrough
      s = s.replace(/~~(.*?)~~/g, '<del class="line-through">$1</del>');

      // bold
      s = s.replace(
        /\*\*(.*?)\*\*/g,
        '<strong class="font-semibold">$1</strong>',
      );
      s = s.replace(/__(.*?)__/g, '<strong class="font-semibold">$1</strong>');

      // italics
      s = s.replace(
        /(^|[^*])\*(?!\*)([^*]+)\*(?!\*)/g,
        (_m, pre, inner) => `${pre}<em class="italic">${inner}</em>`,
      );
      s = s.replace(
        /(^|[^_])_(?!_)([^_]+)_(?!_)/g,
        (_m, pre, inner) => `${pre}<em class="italic">${inner}</em>`,
      );

      return s;
    };

    // 5) Simple line-by-line block handling (headers, paragraphs)
    const lines = src.split("\n");
    let out = "";
    let paragraphOpen = false;

    const closeParagraph = () => {
      if (paragraphOpen) {
        out += "</p>\n";
        paragraphOpen = false;
      }
    };

    for (let line of lines) {
      const hMatch = line.match(/^\s{0,3}(#{1,6})\s+(.*)$/);
      if (hMatch) {
        closeParagraph();
        const level = hMatch[1].length;
        const inner = parseInline(hMatch[2].trim());
        out += `<h${level} class="${level === 1 ? "text-2xl font-bold mt-8 mb-4" : level === 2 ? "text-xl font-semibold mt-8 mb-4" : level === 3 ? "text-lg font-semibold mt-6 mb-3" : ""}">${inner}</h${level}>\n`;
        continue;
      }

      if (/^\s*$/.test(line)) {
        closeParagraph();
        continue;
      }

      if (!paragraphOpen) {
        paragraphOpen = true;
        out += `<p class="mb-4">${parseInline(line)}`;
      } else {
        out += "<br />" + parseInline(line);
      }
    }

    closeParagraph();

    return out;
  };

  return (
    <div
      className="prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: parseMarkdown(content) }}
    />
  );
}
