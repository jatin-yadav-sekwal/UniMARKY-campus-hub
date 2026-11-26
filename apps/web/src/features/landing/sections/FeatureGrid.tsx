import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";

const features = [
  {
    number: "01",
    title: "Verified by your university",
    description:
      "Accounts are tied to a real student identity, so the person across the trade is a peer — not an anonymous stranger.",
  },
  {
    number: "02",
    title: "One login, every tool",
    description:
      "Communities, marketplace, notes, stays and food share the same account, profile and campus context.",
  },
  {
    number: "03",
    title: "Moderation that makes sense",
    description:
      "Community owners and campus admins can remove content that breaks the rules and keep discussions on topic.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="scroll-mt-24 border-t border-um-line py-20 lg:py-28">
      <div className="um-container">
        <Reveal>
          <SectionHeading
            eyebrow="Built differently"
            title="A campus network, not another social app."
            description="No follower counts, no strangers, no algorithm deciding what your campus should care about."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {features.map((feature, index) => (
            <Reveal key={feature.number} delay={index * 0.06}>
              <article className="border-t border-um-ink/15 pt-5">
                <span className="font-display text-[11px] font-semibold tracking-[0.18em] text-um-accent">
                  {feature.number}
                </span>
                <h3 className="mt-3 text-[18px] font-semibold leading-snug tracking-[-0.02em] text-um-ink">
                  {feature.title}
                </h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-um-ink-2">
                  {feature.description}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
