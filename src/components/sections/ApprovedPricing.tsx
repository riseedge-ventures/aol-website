import { BookButton } from "@/components/interactive/BookButton";
import { Icon, type IconName } from "@/components/ui/Icon";
import { blocks, type CopyBlock } from "@/content/approved";
import { ApprovedCopy, CopyText } from "./ApprovedCopy";

const source = blocks(24);
const starts = [8, 26, 47, 70];
export function ApprovedPricingCards() {
  return <div className="pricing__grid">{starts.slice(0, 3).map((start, i) => {
    const content: CopyBlock[] = source.slice(start, starts[i + 1]);
    const price = content[1].text.match(/^From (R[\d,]+) per month$/)!;
    return <div key={start} className={`aol-pricing ${i === 1 ? "aol-pricing--featured" : ""}`}>
      <div className="aol-pricing__head"><span className="aol-pricing__ico"><Icon name={(["layers", "trending-up", "briefcase"] as IconName[])[i]} size={21} /></span><span className="aol-pricing__tier">{content[0].text}</span></div>
      <div className="aol-pricing__price"><span className="aol-pricing__from">From</span><span className="aol-pricing__amt">{price[1]}</span><span className="aol-pricing__per">per month</span></div>
      {content.slice(2, 5).map((b, j) => <p key={j} className="aol-pricing__desc"><CopyText block={b} /></p>)}
      <hr className="aol-pricing__rule" />
      <ul className="aol-pricing__feats">{content.filter(b => b.kind === "bullet").map((b, j) => <li className="aol-pricing__feat" key={j}><Icon name="check" size={18} stroke={2.4} /><span>{b.text.slice(2)}</span></li>)}</ul>
      {content.slice(5).filter(b => b.kind !== "bullet" && !b.text.startsWith("[")).map((b, j) => <p key={j} className="aol-pricing__desc"><CopyText block={b} /></p>)}
      <div className="aol-pricing__cta"><BookButton variant={i === 1 ? "primary" : "outline"} block>{content.at(-1)!.text.slice(1, -1)}</BookButton></div>
    </div>;
  })}</div>;
}

export function ApprovedPricingIntro({ page = false }: { page?: boolean }) {
  return <ApprovedCopy content={source.slice(0, 8)} firstHeading={page ? "h1" : "h2"} />;
}
export function ApprovedPricingTerms() {
  return <div className="pricing__addons"><ApprovedCopy content={source.slice(70)} /></div>;
}
