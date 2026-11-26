import { ArrowRight, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/site/Reveal";
import { SiteButton } from "@/components/site/SiteButton";

export function FinalCta() {
  return (
    <section id="cta" className="scroll-mt-24 pb-20 lg:pb-28">
      <div className="um-container">
        <Reveal>
          <div className="relative overflow-hidden rounded-[32px] bg-um-ink px-6 py-14 text-white sm:px-10 lg:px-16 lg:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute -left-24 -top-32 h-[320px] w-[420px] rounded-full bg-[#a78bfa]/25 blur-[90px]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -bottom-40 right-0 h-[340px] w-[420px] rounded-full bg-[#fb7185]/20 blur-[100px]"
            />

            <div className="relative max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
                <span className="h-1.5 w-1.5 rounded-full bg-um-accent" />
                Your campus is waiting
              </p>

              <h2 className="mt-5 font-display text-[34px] font-semibold leading-[1.03] tracking-[-0.04em] sm:text-[44px] lg:text-[52px]">
                One account.
                <span className="block text-white/70">Your whole campus.</span>
              </h2>

              <p className="mt-5 max-w-lg text-[14.5px] leading-relaxed text-white/65 sm:text-[15px]">
                Join the students using UniMARKY to trade, study, find a place to
                stay and stay connected to their campus.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <SiteButton to="/auth" variant="inverse" size="lg">
                  Create your account
                  <ArrowRight className="h-4 w-4" />
                </SiteButton>
                <SiteButton to="/#ecosystem" variant="ghost-inverse" size="lg">
                  Explore the ecosystem
                </SiteButton>
              </div>

              <p className="mt-6 inline-flex items-center gap-1.5 text-[12px] text-white/50">
                <BadgeCheck className="h-3.5 w-3.5" />
                Free for verified students · Email or Google
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
