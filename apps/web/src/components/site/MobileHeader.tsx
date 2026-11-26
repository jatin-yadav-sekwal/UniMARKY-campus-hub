import { useState } from "react";
import { Menu } from "lucide-react";
import { Brand } from "./Brand";
import { MobileNavigationDrawer } from "./MobileNavigationDrawer";

export function MobileHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-black/[0.055] bg-white/70 px-5 backdrop-blur-xl min-[900px]:hidden">
        <Brand imageClassName="h-6" onNavigate={() => setIsOpen(false)} />
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open navigation"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          className="um-focus flex h-9 w-9 items-center justify-center rounded-full border border-um-line bg-white/85 text-um-ink transition-colors duration-150 hover:bg-white"
        >
          <Menu className="h-4 w-4" />
        </button>
      </header>

      <MobileNavigationDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
