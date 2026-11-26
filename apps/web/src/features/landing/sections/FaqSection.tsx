import { Plus } from "lucide-react";
import { SectionHeading } from "@/components/site/SectionHeading";
import { Reveal } from "@/components/site/Reveal";
import { SiteLink } from "@/components/site/SiteLink";

const faqs = [
  {
    question: "Who can use UniMARKY?",
    answer:
      "Students with a verified university account. Sign in with your email and password or continue with Google during onboarding.",
  },
  {
    question: "Is it free?",
    answer:
      "Yes. Creating an account and using the core campus tools is free for students. There are no paid tiers for browsing or joining communities.",
  },
  {
    question: "Is my campus available yet?",
    answer:
      "UniMARKY is rolling out campus by campus. Sign up with your university email to see whether your campus is live, and your account is ready when it opens.",
  },
  {
    question: "How does the marketplace work?",
    answer:
      "List what you no longer need, browse what other students are selling, and arrange a pickup on campus. Every buyer and seller is a verified student.",
  },
  {
    question: "Can I start my own community?",
    answer:
      "If your account has the create-community permission, open Communities and choose New Community. You become the owner and can invite classmates.",
  },
  {
    question: "How is content moderated?",
    answer:
      "Community owners, moderators and campus admins can remove posts and comments that break a community’s rules. Reporting is available on every post.",
  },
];

export function FaqSection() {
  return (
    <section id="faqs" className="scroll-mt-24 border-t border-um-line py-20 lg:py-28">
      <div className="um-container">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16">
          <Reveal>
            <div className="lg:sticky lg:top-12">
              <SectionHeading
                eyebrow="FAQs"
                title="Good questions, short answers."
                description="Everything students usually ask before they join."
              />
              <p className="mt-6 text-[13px] text-um-ink-2">
                Still unsure?{" "}
                <SiteLink
                  to="/contact"
                  className="font-medium text-um-ink underline decoration-um-ink/25 underline-offset-4 transition-colors duration-150 hover:decoration-um-ink"
                >
                  Talk to the team
                </SiteLink>
                .
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="border-b border-um-line">
              {faqs.map((faq, index) => (
                <details
                  key={faq.question}
                  className="group border-t border-um-line py-5"
                  open={index === 0}
                >
                  <summary className="um-focus flex cursor-pointer list-none items-center justify-between gap-4 rounded-md text-[14.5px] font-medium text-um-ink marker:hidden [&::-webkit-details-marker]:hidden">
                    {faq.question}
                    <Plus
                      aria-hidden
                      className="h-4 w-4 shrink-0 text-um-ink-3 transition-transform duration-200 group-open:rotate-45"
                    />
                  </summary>
                  <p className="max-w-xl pt-3 pr-8 text-[13.5px] leading-relaxed text-um-ink-2">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
