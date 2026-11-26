import { ArrowUpRight, BookOpen, Check, House, Utensils } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { SiteLink } from "@/components/site/SiteLink";

const discovery = [
  {
    title: "Study",
    href: "/study",
    icon: BookOpen,
    iconClass: "bg-[#cffafe] text-[#0e7490]",
    description:
      "Notes, previous year papers and resources organised by course and semester.",
    points: ["Subject-wise library", "Previous year papers", "Save for later"],
  },
  {
    title: "Accommodation",
    href: "/housing",
    icon: House,
    iconClass: "bg-[#dcfce7] text-[#15803d]",
    description:
      "PGs, flats and campus stays listed by students and hosts around your university.",
    points: ["Near-campus filters", "Student listings", "Direct contact"],
  },
  {
    title: "Food",
    href: "/food",
    icon: Utensils,
    iconClass: "bg-[#fef9c3] text-[#a16207]",
    description:
      "Daily menus, price ranges and student favourites from places around campus.",
    points: ["Daily menus", "Price ranges", "Campus favourites"],
  },
];

export function DiscoverySection() {
  return (
    <section id="discover" className="scroll-mt-24 border-t border-um-line py-20 lg:py-28">
      <div className="um-container">
        <Reveal>
          <SectionHeading
            eyebrow="Beyond the feed"
            title="The rest of campus, handled."
            description="The practical stuff between classes — study material, a place to stay and somewhere to eat."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
          {discovery.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05}>
              <article className="flex h-full flex-col rounded-2xl border border-um-line bg-white p-6">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${item.iconClass}`}
                >
                  <item.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.015em] text-um-ink">
                  {item.title}
                </h3>
                <p className="mt-2 text-[13.5px] leading-relaxed text-um-ink-2">
                  {item.description}
                </p>

                <ul className="mt-5 space-y-2.5">
                  {item.points.map((point) => (
                    <li key={point} className="flex items-center gap-2 text-[12.5px] text-um-ink-2">
                      <Check className="h-3.5 w-3.5 shrink-0 text-um-navy" />
                      {point}
                    </li>
                  ))}
                </ul>

                <SiteLink
                  to={item.href}
                  className="mt-6 inline-flex items-center gap-1 text-[12.5px] font-semibold text-um-ink transition-colors duration-150 hover:text-um-accent"
                >
                  Open {item.title}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </SiteLink>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
