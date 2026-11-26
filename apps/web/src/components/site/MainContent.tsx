import type { ReactNode } from "react";

export function MainContent({ children }: { children: ReactNode }) {
  return (
    <main id="main-content" className="relative z-10 min-h-screen">
      {children}
    </main>
  );
}
