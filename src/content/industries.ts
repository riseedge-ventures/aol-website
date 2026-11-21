import type { IconName } from "@/components/ui/Icon";

export type IndustryItem = {
  icon: IconName;
  label: string;
};

/** Owner-approved industry list — hub page only; no thin doorway pages. */
export const INDUSTRIES: IndustryItem[] = [
  {
    "icon": "building-2",
    "label": "SMEs & Owner-Managed Businesses"
  },
  {
    "icon": "rocket",
    "label": "Start-ups & Entrepreneurs"
  },
  {
    "icon": "settings",
    "label": "Manufacturing"
  },
  {
    "icon": "hard-hat",
    "label": "Construction"
  },
  {
    "icon": "briefcase",
    "label": "Professional Services"
  },
  {
    "icon": "heart-handshake",
    "label": "Healthcare & Medical Practices"
  }
];
export const INDUSTRIES_HEADING = "INDUSTRIES WE SERVE";
export const INDUSTRIES_INTRO = "Behind Every Business Owner Is a Business That Must Make Financial Sense.";
