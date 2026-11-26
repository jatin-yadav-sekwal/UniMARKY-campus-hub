import {
  ArrowUpRight,
  BadgeCheck,
  BookOpen,
  Chrome,
  House,
  Mail,
  Search,
  ShoppingBag,
  Users,
  Utensils,
} from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { SiteLink } from "@/components/site/SiteLink";

const ecosystem = [
  {
    title: "Communities",
    description: "Societies, study circles and interest groups with one shared feed.",
    href: "/communities",
    icon: Users,
    iconClass: "bg-[#ede9fe] text-[#6d28d9]",
  },
  {
    title: "Marketplace",
    description: "Buy, sell and trade gear with students on your own campus.",
    href: "/marketplace",
    icon: ShoppingBag,
    iconClass: "bg-[#ffedd5] text-[#c2410c]",
  },
  {
    title: "Study",
    description: "Notes, previous papers and resources that stay findable.",
    href: "/study",
    icon: BookOpen,
    iconClass: "bg-[#cffafe] text-[#0e7490]",
  },
  {
    title: "Accommodation",
    description: "PGs, flats and campus stays listed by people nearby.",
    href: "/housing",
    icon: House,
    iconClass: "bg-[#dcfce7] text-[#15803d]",
  },
  {
    title: "Food",
    description: "Campus dining, daily menus and student deals.",
    href: "/food",
    icon: Utensils,
    iconClass: "bg-[#fef9c3] text-[#a16207]",
  },
  {
    title: "Lost & Found",
    description: "A campus-wide radar for the things that go missing.",
    href: "/lost-found",
    icon: Search,
    iconClass: "bg-[#fee2e2] text-[#b91c1c]",
  },
];

const integrations = [
  { label: "Google sign-in", icon: Chrome },
  { label: "University email", icon: Mail },
  { label: "Verified student", icon: BadgeCheck },
];

export function EcosystemOverview() {
  return (
    <section id="ecosystem" className="scroll-mt-24 border-t border-um-line py-20 lg:py-28">
      <div className="um-container">
        <Reveal>
          <SectionHeading
            eyebrow="The ecosystem"
            title="Six parts of campus. One sign-in."
            description="Every surface is built for the same verified community, so nothing feels like a separate app."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ecosystem.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.03}>
              <SiteLink
                to={item.href}
                className="group flex h-full flex-col rounded-2xl border border-um-line bg-white p-6 transition-[border-color,box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:border-um-ink/15 hover:shadow-[0_16px_40px_-24px_rgba(23,23,23,0.28)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
                  >
                    <item.icon className="h-4.5 w-4.5" />
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-um-ink-3 transition-[color,transform] duration-150 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-um-ink" />
                </div>
                <h3 className="mt-5 text-[16px] font-semibold tracking-[-0.01em] text-um-ink">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-um-ink-2">
                  {item.description}
                </p>
              </SiteLink>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.06}>
          <div
            id="integration"
            className="mt-6 flex scroll-mt-24 flex-col gap-5 rounded-2xl border border-um-line bg-white/70 px-5 py-5 backdrop-blur-sm sm:px-6 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-[14px] font-semibold text-um-ink">
                Works with the accounts you already have.
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-um-ink-2">
                Sign in with Google or your university email — no new password to
                remember.
              </p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {integrations.map((item) => (
                <li
                  key={item.label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-um-line bg-white px-3 py-1.5 text-[11.5px] font-medium text-um-ink-2"
                >
                  <item.icon className="h-3.5 w-3.5 text-um-navy" />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
