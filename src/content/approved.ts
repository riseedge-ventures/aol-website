import copy from "./approved-copy.json";

export type CopyBlock = (typeof copy)[number]["blocks"][number];
export const APPROVED = copy;
export const blocks = (section: number) => APPROVED[section].blocks;
export const words = (section: number, block: number) => blocks(section)[block].text;
export function splitAtHeadings(section: number, pattern: RegExp) {
  const source = blocks(section);
  const starts = source.flatMap((b, i) => b.kind === "heading" && pattern.test(b.text) ? [i] : []);
  return starts.map((start, i) => source.slice(start, starts[i + 1] ?? source.length));
}
