import { useEffect, useRef } from "react";
import { AnimatePresence, m } from "motion/react";
import { X } from "lucide-react";
import { Brand } from "./Brand";
import { SidebarNavigation } from "./SidebarNavigation";
import { AccountSection } from "./AccountSection";

interface MobileNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigationDrawer({ isOpen, onClose }: MobileNavigationDrawerProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);

    const focusTimer = window.setTimeout(() => closeButtonRef.current?.focus(), 40);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen ? (
        <div className="fixed inset-0 z-50 min-[900px]:hidden">
          <m.button
            type="button"
            aria-label="Close navigation backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="absolute inset-0 h-full w-full cursor-default bg-black/20 backdrop-blur-[2px]"
          />

          <m.div
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.24, ease: [0.32, 0.72, 0, 1] }}
            className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col bg-white shadow-[-24px_0_60px_rgba(23,23,23,0.12)]"
          >
            <div className="flex items-center justify-between border-b border-um-line px-5 py-4">
              <Brand imageClassName="h-6" onNavigate={onClose} />
              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close navigation"
                className="um-focus flex h-9 w-9 items-center justify-center rounded-full border border-um-line text-um-ink-2 transition-colors duration-150 hover:bg-um-mist hover:text-um-ink"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto px-5 pb-6">
              <SidebarNavigation onNavigate={onClose} className="mt-6" />
              <div className="mt-auto pt-10">
                <AccountSection variant="drawer" onNavigate={onClose} />
              </div>
            </div>
          </m.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
