import React, { useState } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "katex/dist/katex.min.css";
import { handleCopy } from "@/lib/utils";
import { Tick, Copy } from "./SVG";
interface MarkdownProps {
  content: string;
}

// Code block
const CodeBlock: Components["code"] = ({
  className,
  children,
  node,
  style,
  ref,
  ...props
}) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const codeString = String(children).replace(/\n$/, "");

  if (match) {
    return (
      <div className="relative my-1.5">
        {/* Header with language label and copy button */}
        <div className="absolute top-1 mb-1 flex w-full items-center justify-between px-2 text-xs">
          <span>{match[1]}</span>

          <button
            onClick={async () => await handleCopy(setCopied, codeString)}
            className="text-text-primary cursor-pointer rounded px-2 py-1"
          >
            <span className="flex items-center gap-1">
              {copied ? (
                <Tick aria-hidden="true" />
              ) : (
                <Copy aria-hidden="true" />
              )}
              {copied ? "Copied" : "Copy Code"}
            </span>
          </button>
        </div>

        {/* Code block */}
        <SyntaxHighlighter
          language={match[1]}
          style={vscDarkPlus}
          PreTag="div"
          customStyle={{
            background: "var(--color-bg-secondary)",
            borderRadius: "1rem",
            padding: "2rem 0.75rem 0.75rem 0.75rem", // increased top padding
            margin: 0,
          }}
          {...props}
        >
          {codeString}
        </SyntaxHighlighter>
      </div>
    );
  }

  // Inline code fallback
  return (
    <code
      className="rounded px-1 font-mono text-sm"
      style={{
        backgroundColor: "var(--color-bg-tertiary)",
        color: "var(--color-text-primary)",
      }}
    >
      {children}
    </code>
  );
};

// Headers
const Header1: Components["h1"] = ({ children }) => (
  <h1
    className="my-1.5 text-3xl font-bold"
    style={{ color: "var(--color-text-primary)" }}
  >
    {children}
  </h1>
);
const Header2: Components["h2"] = ({ children }) => (
  <h2
    className="my-0.5 text-2xl font-semibold"
    style={{ color: "var(--color-text-primary)" }}
  >
    {children}
  </h2>
);
const Header3: Components["h3"] = ({ children }) => (
  <h3
    className="my-0.5 text-xl font-semibold"
    style={{ color: "var(--color-text-primary)" }}
  >
    {children}
  </h3>
);
const Header4: Components["h4"] = ({ children }) => (
  <h4
    className="my-0.5 text-lg font-semibold"
    style={{ color: "var(--color-text-primary)" }}
  >
    {children}
  </h4>
);
const Header5: Components["h5"] = ({ children }) => (
  <h5
    className="my-0.5 text-base font-semibold"
    style={{ color: "var(--color-text-primary)" }}
  >
    {children}
  </h5>
);
const Header6: Components["h6"] = ({ children }) => (
  <h6
    className="my-0.5 text-sm font-semibold"
    style={{ color: "var(--color-text-primary)" }}
  >
    {children}
  </h6>
);

// Paragraph
const Paragraph: Components["p"] = ({ children }) => (
  <p
    className="my-0.5 text-base leading-relaxed"
    style={{ color: "var(--color-text-primary)" }}
  >
    {children}
  </p>
);

// Anchor
const Anchor: Components["a"] = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="underline"
    style={{ color: "var(--color-text-accent)" }}
  >
    {children}
  </a>
);

// Lists
const UnorderedList: Components["ul"] = ({ children }) => (
  <ul className="my-0.5 list-inside list-disc">{children}</ul>
);
const OrderedList: Components["ol"] = ({ children }) => (
  <ol className="my-0.5 list-inside list-decimal">{children}</ol>
);
const ListItem: Components["li"] = ({ children }) => (
  <li className="ml-4">{children}</li>
);

// Horizontal rule
const HorizontalRule: Components["hr"] = () => (
  <hr
    className="my-2 border-t"
    style={{ borderColor: "var(--color-border-default)" }}
  />
);

// Tables
const Table: Components["table"] = ({ children }) => (
  <div className="my-1.5 overflow-x-auto">
    <table
      className="w-full table-auto border-collapse text-sm"
      style={{ borderColor: "var(--color-border-default)" }}
    >
      {children}
    </table>
  </div>
);
const TableHead: Components["thead"] = ({ children }) => (
  <thead style={{ backgroundColor: "var(--color-bg-secondary)" }}>
    {children}
  </thead>
);
const TableRow: Components["tr"] = ({ children, node }) => {
  // alternating row colors
  const index = node?.position?.start?.line || 0;
  const bgColor =
    index % 2 === 0 ? "var(--color-bg-primary)" : "var(--color-bg-tertiary)";
  return <tr style={{ backgroundColor: bgColor }}>{children}</tr>;
};
const TableHeadCell: Components["th"] = ({ children }) => (
  <th
    className="border px-3 py-0.5 text-left font-semibold"
    style={{ borderColor: "var(--color-border-default)" }}
  >
    {children}
  </th>
);
const TableCell: Components["td"] = ({ children }) => (
  <td
    className="border px-3 py-0.5"
    style={{ borderColor: "var(--color-border-default)" }}
  >
    {children}
  </td>
);

// Inline styles
const Emphasis: Components["em"] = ({ children }) => <em>{children}</em>;
const Strong: Components["strong"] = ({ children }) => (
  <strong>{children}</strong>
);
const Strikethrough: Components["del"] = ({ children }) => (
  <del>{children}</del>
);

// Blockquote
const Blockquote: Components["blockquote"] = ({ children }) => (
  <blockquote
    className="my-0.5 py-1 pl-4 italic"
    style={{
      borderLeft: "4px solid var(--color-border-default)",
      backgroundColor: "var(--color-bg-secondary)",
      color: "var(--color-text-secondary)",
    }}
  >
    {children}
  </blockquote>
);

const MDComponents: Components = {
  code: CodeBlock,
  h1: Header1,
  h2: Header2,
  h3: Header3,
  h4: Header4,
  h5: Header5,
  h6: Header6,
  p: Paragraph,
  a: Anchor,
  ul: UnorderedList,
  ol: OrderedList,
  li: ListItem,
  hr: HorizontalRule,
  table: Table,
  thead: TableHead,
  tr: TableRow,
  th: TableHeadCell,
  td: TableCell,
  em: Emphasis,
  strong: Strong,
  del: Strikethrough,
  blockquote: Blockquote,
};

export default function Markdown({ content }: MarkdownProps) {
  return (
    <ReactMarkdown
      components={MDComponents}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeSanitize]}
    >
      {content}
    </ReactMarkdown>
  );
}
