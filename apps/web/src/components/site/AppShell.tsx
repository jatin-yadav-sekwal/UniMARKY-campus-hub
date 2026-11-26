import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { GradientBackground } from "./GradientBackground";
import { Sidebar } from "./Sidebar";
import { MobileHeader } from "./MobileHeader";
import { MainContent } from "./MainContent";
import { Footer } from "./Footer";

/** Public website shell: fixed gradient, fixed sidebar, content column, footer. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={cn("relative min-h-screen bg-white font-sans text-um-ink antialiased")}>
      <GradientBackground />

      <a href="#main-content" className="um-skip-link">
        Skip to content
      </a>

      <Sidebar />

      <div className="relative z-10 min-h-screen min-[900px]:pl-[250px]">
        <MobileHeader />
        <MainContent>{children}</MainContent>
        <Footer />
      </div>
    </div>
  );
}
