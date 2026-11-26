import {
  ArrowUpRight,
  Coffee,
  MessageCircle,
  PenTool,
  ShoppingBag,
  Tablet,
  Users,
} from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { SiteLink } from "@/components/site/SiteLink";

const communityPosts = [
  {
    initials: "RC",
    avatarClass: "bg-[#ede9fe] text-[#6d28d9]",
    group: "Robotics Club",
    time: "2m",
    message: "Anyone free for a build session on Saturday? We have the new servo kit.",
    meta: "12 replies",
  },
  {
    initials: "PC",
    avatarClass: "bg-[#dcfce7] text-[#15803d]",
    group: "Placement Cell",
    time: "18m",
    message: "TCS drive registration closes Friday. Drop your questions here.",
    meta: "34 saves",
  },
  {
    initials: "PS",
    avatarClass: "bg-[#ffedd5] text-[#c2410c]",
    group: "Photography Society",
    time: "1h",
    message: "Golden hour walk around the lake at 5. Bring whatever camera you have.",
    meta: "8 going",
  },
];

const marketplaceItems = [
  {
    title: "iPad Air (2022)",
    price: "₹24,000",
    condition: "Like new",
    icon: Tablet,
    thumbClass: "bg-[#ede9fe] text-[#6d28d9]",
  },
  {
    title: "Engineering drawing board",
    price: "₹450",
    condition: "Good",
    icon: PenTool,
    thumbClass: "bg-[#cffafe] text-[#0e7490]",
  },
  {
    title: "Electric kettle",
    price: "₹600",
    condition: "New",
    icon: Coffee,
    thumbClass: "bg-[#ffedd5] text-[#c2410c]",
  },
];

export function PreviewsSection() {
  return (
    <section id="preview" className="scroll-mt-24 border-t border-um-line py-20 lg:py-28">
      <div className="um-container">
        <Reveal>
          <SectionHeading
            eyebrow="A look inside"
            title="Your campus, already moving."
            description="A living feed and a marketplace that resets every semester — both scoped to the people you actually share a campus with."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-[1.12fr_0.88fr]">
          {/* Communities preview */}
          <Reveal>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-um-line bg-white shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-um-line px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ede9fe] text-[#6d28d9]">
                    <Users className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold leading-tight text-um-ink">
                      Communities
                    </p>
                    <p className="text-[11px] text-um-ink-3">Interest groups · Study circles</p>
                  </div>
                </div>
                <SiteLink
                  to="/communities"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-um-ink-2 transition-colors duration-150 hover:text-um-ink"
                >
                  Browse all
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </SiteLink>
              </div>

              <ul className="flex-1 divide-y divide-um-line/80 px-5 sm:px-6">
                {communityPosts.map((post) => (
                  <li key={post.group} className="flex gap-3 py-4">
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${post.avatarClass}`}
                    >
                      {post.initials}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                        <p className="text-[12.5px] font-semibold text-um-ink">{post.group}</p>
                        <span className="text-[10.5px] text-um-ink-3">{post.time}</span>
                      </div>
                      <p className="mt-0.5 text-[13px] leading-snug text-um-ink-2">
                        {post.message}
                      </p>
                      <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] text-um-ink-3">
                        <MessageCircle className="h-3 w-3" />
                        {post.meta}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 border-t border-um-line bg-um-mist/60 px-5 py-3.5 sm:px-6">
                {["Societies", "Study circles", "Interest groups"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-um-line bg-white px-2.5 py-1 text-[10.5px] font-medium text-um-ink-2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          </Reveal>

          {/* Marketplace preview */}
          <Reveal delay={0.08}>
            <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-um-line bg-white shadow-[0_1px_2px_rgba(23,23,23,0.04)]">
              <div className="flex items-center justify-between gap-4 border-b border-um-line px-5 py-4 sm:px-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ffedd5] text-[#c2410c]">
                    <ShoppingBag className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold leading-tight text-um-ink">
                      Marketplace
                    </p>
                    <p className="text-[11px] text-um-ink-3">Campus pickup · Verified buyers</p>
                  </div>
                </div>
                <SiteLink
                  to="/marketplace"
                  className="inline-flex items-center gap-1 text-[12px] font-medium text-um-ink-2 transition-colors duration-150 hover:text-um-ink"
                >
                  Browse all
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </SiteLink>
              </div>

              <ul className="flex-1 space-y-2.5 p-4 sm:p-5">
                {marketplaceItems.map((item) => (
                  <li
                    key={item.title}
                    className="flex items-center gap-3 rounded-xl border border-um-line/80 p-2.5 transition-colors duration-150 hover:bg-um-mist/70"
                  >
                    <span
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${item.thumbClass}`}
                    >
                      <item.icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12.5px] font-semibold text-um-ink">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[11px] text-um-ink-3">
                        {item.condition} · Campus pickup
                      </span>
                    </span>
                    <span className="shrink-0 text-[12.5px] font-semibold text-um-ink">
                      {item.price}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="border-t border-um-line px-5 py-4 sm:px-6">
                <p className="text-[11.5px] leading-relaxed text-um-ink-3">
                  Every listing is from a student on your campus. Meet on campus,
                  pay in person, keep it simple.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
