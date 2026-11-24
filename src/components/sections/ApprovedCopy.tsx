import { BookButton } from "@/components/interactive/BookButton";
import { Button } from "@/components/ui/Button";
import { type CopyBlock } from "@/content/approved";
import { Fragment } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";

/** PDF line wrapping is removed at extraction; words and emphasis remain source-owned. */
export function CopyText({ block }: { block: CopyBlock }) {
  return <>{block.runs.map((run, i) => {
    const content = "italic" in run && run.italic ? <em>{run.text}</em> : run.text;
    return <Fragment key={i}>{"bold" in run && run.bold ? <strong>{content}</strong> : content}</Fragment>;
  })}</>;
}

export function ApprovedCopy({ content, firstHeading = "h2" }: {
  content: CopyBlock[];
  firstHeading?: "h1" | "h2" | "h3";
}) {
  const hasPageHeading = content[0]?.kind === "heading" && content[1]?.kind === "heading";
  return <div className="prose">
    {hasPageHeading && <SectionHeading as={firstHeading} eyebrow={content[0].text} title={content[1].text} />}
    {content.map((block, i) => {
    if (hasPageHeading && i < 2) return null;
    const text = block.text;
    const actions = text.startsWith("[") ? [...text.matchAll(/\[([^\]]+)\]/g)].map(m => m[1])
      : /^(?:(?:Primary|Secondary|Form) Action|Action): /.test(text) ? [text.replace(/^[^:]+: /, "")] : [];
    if (actions.length) return <div key={i} className="page-cta-row">{actions.map(label =>
      /Consultation|Enquir/i.test(label) ? <BookButton key={label} size="lg">{label}</BookButton>
        : <Button key={label} href="/services/" variant="outline">{label}</Button>
    )}</div>;
    if (block.kind === "heading") {
      const firstContentIndex = hasPageHeading ? 2 : 0;
      const hasEarlierHeading = hasPageHeading || content.slice(firstContentIndex, i).some((item) => item.kind === "heading");
      const Tag = hasEarlierHeading ? "h3" : firstHeading;
      return <Tag key={i} className="page-subheading"><CopyText block={block} /></Tag>;
    }
    if (block.kind === "bullet") {
      if (content[i - 1]?.kind === "bullet") return null;
      const list = content.slice(i, content.findIndex((b, n) => n > i && b.kind !== "bullet") === -1 ? undefined : content.findIndex((b, n) => n > i && b.kind !== "bullet"));
      return <ul className="page-list" key={i}>{list.map((item, j) => <li key={j}>{item.text.slice(2)}</li>)}</ul>;
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) return <p key={i}><a href={`mailto:${text}`}>{text}</a></p>;
    if (text === "+27 72 206 7130") return <p key={i}><a href="tel:+27722067130">{text}</a></p>;
    return <p key={i}><CopyText block={block} /></p>;
  })}</div>;
}
