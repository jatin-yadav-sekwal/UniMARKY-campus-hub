import type { LucideIcon } from "lucide-react";

export interface LandingFeature {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  href: string;
  status: "live" | "coming-soon";
}
