import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";

const stats = [
  { value: "6", label: "campus tools in one hub" },
  { value: "1", label: "verified student identity" },
  { value: "0", label: "strangers outside your campus" },
];

export function PlatformIntro() {
  return (
    <section id="platform" className="scroll-mt-24 py-20 lg:py-28">
      <div className="um-container">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <SectionHeading
              eyebrow="Why UniMARKY"
              title={
                <>
                  Campus life is scattered.
                  <span className="block text-um-ink-2">We put it back together.</span>
                </>
              }
            />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="lg:pt-2">
              <p className="max-w-xl text-[15px] leading-relaxed text-um-ink-2 sm:text-base">
                Group chats, notice boards, spreadsheets and a dozen different
                links. UniMARKY gives your university one shared place for the
                everyday things students actually need — without the noise.
              </p>

              <dl className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-5">
                {stats.map((stat) => (
                  <div key={stat.label} className="border-t border-um-line pt-4">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-[34px] font-semibold leading-none tracking-[-0.04em] text-um-ink">
                        {stat.value}
                      </span>
                      <span className="mt-2 block text-[12.5px] leading-snug text-um-ink-2">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
