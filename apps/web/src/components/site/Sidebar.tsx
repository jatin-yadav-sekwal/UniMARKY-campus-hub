import { Brand } from "./Brand";
import { SidebarNavigation } from "./SidebarNavigation";
import { AccountSection } from "./AccountSection";

/**
 * Fixed, transparent desktop sidebar. The page's gradient stays visible behind
 * it — no background, border, card or shadow of its own.
 */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[250px] min-[900px]:block">
      <div className="flex h-full flex-col pl-8 pr-5 min-[1200px]:pl-10">
        <div className="pt-[60px]">
          <Brand />
        </div>

        <SidebarNavigation />

        <div className="mt-auto pb-10">
          <AccountSection />
        </div>
      </div>
    </aside>
  );
}
