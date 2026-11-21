import { blocks } from "./approved";
import type { IconName } from "@/components/ui/Icon";
const source = blocks(24);
export const PRICING_PLANS = [8, 26, 47].map((start, i) => ({
  tier: source[start].text,
  price: source[start + 1].text,
  icon: (["layers", "trending-up", "briefcase"] as IconName[])[i],
  description: source[start + 3].text,
  features: source.slice(start + 5, [26, 47, 70][i]).filter(b => b.kind === "bullet").map(b => b.text.slice(2)),
}));
export const PRICING_ADDONS = source.slice(74, 94);
export const PRICING_ONCE_OFF_NOTE = source[93].text;
export const PRICING_FINE_PRINT = source[106].text;
