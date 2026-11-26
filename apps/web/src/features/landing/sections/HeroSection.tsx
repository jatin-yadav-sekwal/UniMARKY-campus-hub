import {
  ArrowDownRight,
  ArrowRight,
  BadgeCheck,
  FileText,
  ShieldCheck,
  ShoppingBag,
  Users,
} from "lucide-react";
import { SiteButton } from "@/components/site/SiteButton";
import { Reveal } from "@/components/site/Reveal";

const pulseItems = [
  {
    icon: Users,
    iconClass: "bg-[#ede9fe] text-[#6d28d9]",
    label: "Robotics Club",
    line: "Build session this Saturday — all years welcome.",
    meta: "12 replies · 2m",
  },
  {
    icon: ShoppingBag,
    iconClass: "bg-[#ffedd5] text-[#c2410c]",
    label: "Marketplace",
    line: "Calculus: Early Transcendentals · ₹250",
    meta: "2nd year · Like new",
  },
  {
    icon: FileText,
    iconClass: "bg-[#cffafe] text-[#0e7490]",
    label: "Study",
    line: "DBMS Unit 3 notes uploaded by CSE · 4th sem.",
    meta: "48 saves · Today",
  },
];

export function HeroSection() {
  return (
    <section
      id="hero"
      className="relative flex min-h-[calc(100dvh-64px)] items-center py-14 sm:py-20 min-[900px]:min-h-[100dvh] min-[900px]:py-24"
    >
      <div className="um-container">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-14">
          <div className="max-w-[620px]">
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/55 bg-white/40 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-um-ink-2 backdrop-blur-md">
                <span className="h-1.5 w-1.5 rounded-full bg-um-accent" />
                The digital campus network
              </p>
            </Reveal>

            <Reveal delay={0.06}>
              <h1 className="mt-6 font-display text-[42px] font-semibold leading-[1.01] tracking-[-0.045em] text-um-ink sm:text-[54px] lg:text-[64px]">
                Your university.
                <span className="block text-um-navy">In one place.</span>
              </h1>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-6 max-w-[470px] text-[15px] leading-relaxed text-um-ink-2 sm:text-[17px]">
                Communities, marketplace, study notes, stays and campus food —
                built for verified students at your university.
              </p>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <SiteButton to="/auth" size="lg">
                  Join your campus
                  <ArrowRight className="h-4 w-4" />
                </SiteButton>
                <SiteButton to="/#ecosystem" variant="secondary" size="lg">
                  Explore the ecosystem
                  <ArrowDownRight className="h-4 w-4" />
                </SiteButton>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12.5px] text-um-ink-2">
                <span className="inline-flex items-center gap-1.5">
                  <BadgeCheck className="h-4 w-4 text-um-navy" />
                  Verified students only
                </span>
                <span className="hidden h-3 w-px bg-um-ink/15 sm:block" />
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-um-navy" />
                  Email or Google sign-in
                </span>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.16} y={20} className="relative mx-auto w-full max-w-[470px] lg:mx-0 lg:justify-self-end">
            <div
              aria-hidden
              className="absolute -inset-8 rounded-[40px] bg-white/25 blur-2xl"
            />
            <div className="relative rounded-[28px] border border-white/65 bg-white/60 p-2 shadow-[0_30px_90px_-30px_rgba(23,23,23,0.32)] backdrop-blur-xl">
              <div className="rounded-[21px] border border-um-line/80 bg-white p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3 border-b border-um-line pb-4">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-um-accent/25" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-um-accent" />
                    </span>
                    <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-um-ink-2">
                      Campus pulse
                    </p>
                  </div>
                  <span className="rounded-full bg-um-mist px-2.5 py-1 text-[10.5px] font-medium text-um-ink-2">
                    Your campus
                  </span>
                </div>

                <ul className="divide-y divide-um-line/80">
                  {pulseItems.map((item) => (
                    <li key={item.label} className="flex gap-3 py-3.5 first:pt-4 last:pb-4">
                      <span
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.iconClass}`}
                      >
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[12.5px] font-semibold text-um-ink">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-[12.5px] leading-snug text-um-ink-2">
                          {item.line}
                        </span>
                        <span className="mt-1 block text-[11px] text-um-ink-3">{item.meta}</span>
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-2 rounded-xl bg-um-mist px-3 py-2.5 text-[11.5px] text-um-ink-2">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-um-navy" />
                  Everything stays scoped to your university.
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
