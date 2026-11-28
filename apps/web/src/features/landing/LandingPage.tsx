import type { ReactNode } from "react";
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  ChevronDown,
  Compass,
  GraduationCap,
  MapPin,
  Plus,
  ShoppingBag,
  Utensils,
  Users,
} from "lucide-react";
import brandMark from "@/assets/brand-mark.svg";
import { Atmosphere } from "@/components/site/Atmosphere";
import { useAuth } from "@/hooks/useAuth";
import { SiteFooter } from "./SiteFooter";
import { SiteNavigation } from "./SiteNavigation";
import { LandingLink } from "./LandingLink";
import "./landing.css";

function SectionLabel({ number, children }: { number: string; children: ReactNode }) {
  return (
    <div className="section-label">
      <span>{number} /</span>
      {children}
    </div>
  );
}

/** The six working spaces of the platform — every one links to a real page. */
const services: {
  title: string;
  to: string;
  icon: LucideIcon;
  description: string;
  note: string;
}[] = [
  {
    title: "Marketplace",
    to: "/marketplace",
    icon: ShoppingBag,
    description: "Buy and sell with verified students from your university.",
    note: "BUY / SELL",
  },
  {
    title: "Communities",
    to: "/communities",
    icon: Users,
    description: "Clubs, batches and campus events, run by the students in them.",
    note: "PEOPLE & PLACES",
  },
  {
    title: "Study",
    to: "/study",
    icon: BookOpen,
    description: "Notes, previous-year papers and resources by course and semester.",
    note: "LEARN AT YOUR PACE",
  },
  {
    title: "Accommodation",
    to: "/housing",
    icon: Building2,
    description: "PGs, flats and campus stays listed near your university.",
    note: "A PLACE TO LAND",
  },
  {
    title: "Food",
    to: "/food",
    icon: Utensils,
    description: "Daily menus, price ranges and student favourites around campus.",
    note: "GOOD THINGS NEARBY",
  },
  {
    title: "Lost & Found",
    to: "/lost-found",
    icon: MapPin,
    description: "Report what you lost or found and get it back to its owner.",
    note: "REPORT AN ITEM",
  },
];

const listings = [
  { item: "Textbooks & course notes", meta: "Like new · 2nd year", price: "₹250" },
  { item: "Study lamp with timer", meta: "Hostel block C · Working", price: "₹400" },
  { item: "Cycle, serviced", meta: "New tyres · North gate", price: "₹3,200" },
];

const faqs = [
  {
    question: "What can I do on Unimarky?",
    answer:
      "Marketplace, communities, study material, accommodation, food and lost & found — one student account for all six, scoped to your university.",
  },
  {
    question: "Who can use it?",
    answer:
      "Students. Create an account, then pick your university during onboarding; that choice sets which listings, communities and resources you see.",
  },
  {
    question: "Do I need an account to browse?",
    answer:
      "Yes. Every service sits behind the same student account, so you sign up once and move between them without signing in again.",
  },
  {
    question: "How do I sell something?",
    answer:
      "Open Marketplace and choose List an item. Add a title, price, description and photos; the listing then appears in your university's marketplace for other students to find.",
  },
  {
    question: "How do I contact a seller or host?",
    answer:
      "Each listing has a contact section. If the seller or host shared a phone number, it is shown there so you can reach them directly.",
  },
  {
    question: "How do I get help?",
    answer:
      "Use the Contact page to reach the team. Include the page you were on and what went wrong so we can look into it.",
  },
];

function EcosystemMap() {
  return (
    <div className="ecosystem-map" aria-label="A diagram connecting campus life services">
      <div className="map-topline">
        <span>THE CAMPUS, IN ONE PLACE</span>
        <span>FIG. 01</span>
      </div>
      <div className="map-canvas">
        <div className="orbit orbit-one" />
        <div className="orbit orbit-two" />
        <div className="map-node node-campus">
          <GraduationCap size={19} />
          <span>
            YOUR
            <br />
            UNIVERSITY
          </span>
        </div>
        <div className="map-node node-stay">
          <Building2 size={17} />
          <span>STAY</span>
        </div>
        <div className="map-node node-study">
          <BookOpen size={17} />
          <span>STUDY</span>
        </div>
        <div className="map-node node-people">
          <Users size={17} />
          <span>PEOPLE</span>
        </div>
        <div className="map-node node-eat">
          <Utensils size={17} />
          <span>EAT</span>
        </div>
        <div className="map-node node-market">
          <Compass size={17} />
          <span>FIND</span>
        </div>
        <span className="map-coordinate coord-one">51°30&apos;26.4"N</span>
        <span className="map-coordinate coord-two">CAMPUS / 001</span>
      </div>
      <div className="map-legend">
        <span>
          <i />
          CAMPUS LIFE, CONNECTED
        </span>
        <span>
          EXPLORE <ArrowUpRight size={13} />
        </span>
      </div>
    </div>
  );
}

export function LandingPage() {
  const { hash } = useLocation();
  const { session } = useAuth();
  const prefersReducedMotion = useReducedMotion();

  // Hash links from other pages (e.g. /#faqs) land on the right section.
  useEffect(() => {
    if (!hash) return;

    const targetId = hash.slice(1);
    const timer = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }, 80);

    return () => window.clearTimeout(timer);
  }, [hash, prefersReducedMotion]);

  // Signed-in students never need the marketing page — send them straight to
  // the app. ProtectedRoute still decides between /dashboard and /onboarding.
  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="um-landing">
      <Atmosphere />

      <div className="um-landing-content">
        <SiteNavigation />

        <main className="main-shell" id="top">
          <div className="page-rules" aria-hidden="true">
            <i />
            <i />
          </div>
          <div className="main-content">
            <section className="hero" aria-labelledby="hero-title">
              <div className="hero-meta">
                <span>
                  <i /> STUDENT LIFE
                </span>
                <span>
                  CAMPUS / 01 <ArrowDownRight size={13} />
                </span>
              </div>
              <div className="hero-grid">
                <div className="hero-copy">
                  <p className="eyebrow">A student life platform</p>
                  <h1 id="hero-title">
                    University life,
                    <br />
                    in one <span>place.</span>
                  </h1>
                  <p className="hero-lead">
                    Buy and sell on campus, find communities, study resources, stays and
                    food — one account for all of it.
                  </p>
                  <div className="hero-actions">
                    <LandingLink className="button button-primary" to="/#ecosystem">
                      Explore the ecosystem <ArrowRight size={15} />
                    </LandingLink>
                    <LandingLink className="button button-secondary" to="/marketplace">
                      Browse the marketplace
                    </LandingLink>
                  </div>
                </div>
                <EcosystemMap />
              </div>
              <LandingLink className="scroll-cue" to="/#ecosystem">
                <span>SCROLL TO EXPLORE</span>
                <ChevronDown size={14} />
              </LandingLink>
            </section>

            <section className="intro-section" id="ecosystem">
              <SectionLabel number="01">A connected campus</SectionLabel>
              <div className="intro-grid">
                <h2>
                  Useful campus services, <span>in one place.</span>
                </h2>
                <div>
                  <p className="section-lead">
                    Marketplace, communities, study material, accommodation, food and lost
                    & found — all of it scoped to your university.
                  </p>
                  <LandingLink className="text-link" to="/#services">
                    Explore the platform <ArrowRight size={15} />
                  </LandingLink>
                </div>
              </div>
              <div className="intro-index">
                <span>STUDENT SERVICES</span>
                <span>UNIMARKY</span>
              </div>
            </section>

            <section className="market-section" id="marketplace">
              <SectionLabel number="02">Marketplace</SectionLabel>
              <div className="market-layout">
                <div className="market-copy">
                  <h2>
                    Buy and sell
                    <br />
                    <span>on campus.</span>
                  </h2>
                  <p className="market-lead">
                    List textbooks, hostel gear, cycles and electronics. Every seller is a
                    verified student from your university, so you always know who you are
                    dealing with.
                  </p>
                  <div className="hero-actions">
                    <LandingLink className="button button-primary" to="/marketplace">
                      Browse the marketplace <ArrowRight size={15} />
                    </LandingLink>
                    <LandingLink className="button button-secondary" to="/marketplace/list">
                      List an item
                    </LandingLink>
                  </div>
                </div>
                <div className="market-board">
                  <div className="market-board-head">
                    <span>LISTING BOARD</span>
                    <span>EXAMPLES</span>
                  </div>
                  <ul>
                    {listings.map((listing) => (
                      <li className="market-row" key={listing.item}>
                        <span className="market-row-copy">
                          <strong>{listing.item}</strong>
                          <small>{listing.meta}</small>
                        </span>
                        <span className="market-row-price">{listing.price}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="market-board-foot">
                    <span>LISTINGS STAY INSIDE YOUR UNIVERSITY</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="community-section" id="community">
              <div className="community-art" aria-hidden="true">
                <div className="art-rule art-rule-a" />
                <div className="art-rule art-rule-b" />
                <div className="art-card">
                  <span>FIELD NOTE 001</span>
                  <div className="art-stamp">
                    <img src={brandMark} alt="" />
                  </div>
                  <span>
                    STUDENT
                    <br />
                    COMMUNITY
                  </span>
                </div>
                <span className="art-side-label">CAMPUS / COMMUNITY / CONNECTION</span>
              </div>
              <div className="community-copy">
                <SectionLabel number="03">Community</SectionLabel>
                <h2>
                  Meet people
                  <br />
                  <span>on your campus.</span>
                </h2>
                <p>
                  Clubs, batches and campus events — run by the students who are already
                  there. Join a group, post an update, find your people.
                </p>
                <LandingLink className="text-link" to="/communities">
                  Explore community <ArrowRight size={15} />
                </LandingLink>
              </div>
            </section>

            <section className="study-section" id="study">
              <SectionLabel number="04">Make room to learn</SectionLabel>
              <div className="study-layout">
                <div>
                  <h2>
                    Make space
                    <br />
                    for <span>what&apos;s next.</span>
                  </h2>
                  <p>
                    Notes, previous-year papers and course resources organised by subject
                    and semester. Save what you need for the exam you have not met yet.
                  </p>
                  <LandingLink className="button button-primary" to="/study">
                    Explore study resources <ArrowRight size={15} />
                  </LandingLink>
                </div>
                <div className="study-note">
                  <span className="note-label">
                    A NOTE TO SELF <span>01 — 04</span>
                  </span>
                  <p>Find a quiet place to focus on your next study session.</p>
                  <div className="note-bottom">
                    <span>YOUR JOURNEY, YOUR WAY</span>
                    <BookOpen size={17} />
                  </div>
                </div>
              </div>
            </section>

            <section className="neighborhood-section" id="accommodation">
              <div className="neighborhood-copy">
                <SectionLabel number="05">Settle in, your way</SectionLabel>
                <h2>
                  A place to land.
                  <br />
                  <span>Room to grow.</span>
                </h2>
                <p>
                  PGs, flats and campus stays listed by students and hosts near your
                  university. Filter by distance, then talk to the host directly.
                </p>
                <LandingLink className="text-link" to="/housing">
                  Explore accommodation <ArrowRight size={15} />
                </LandingLink>
              </div>
              <div className="neighborhood-visual">
                <div className="visual-top">
                  <span>FIND YOUR CORNER</span>
                  <MapPin size={15} />
                </div>
                <div className="building-lines">
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                  <div />
                </div>
                <div className="visual-bottom">
                  <span>
                    ACCOMMODATION
                    <br />
                    NEAR CAMPUS
                  </span>
                  <span>FIG. 02</span>
                </div>
              </div>
            </section>

            <section className="food-section" id="food">
              <div className="food-marker">
                <Utensils size={20} />
                <span>AROUND THE TABLE</span>
              </div>
              <div className="food-copy">
                <SectionLabel number="06">A taste of campus</SectionLabel>
                <h2>
                  Good food.
                  <br />
                  <span>Good company.</span>
                </h2>
                <p>
                  Daily menus, price ranges and student favourites from the places around
                  campus — and the exact dish you are looking for.
                </p>
                <LandingLink className="text-link" to="/food">
                  See what&apos;s nearby <ArrowRight size={15} />
                </LandingLink>
              </div>
            </section>

            <section className="services-section" id="services">
              <SectionLabel number="07">One campus, integrated</SectionLabel>
              <div className="services-heading">
                <h2>
                  Campus life, split into
                  <br />
                  <span>six useful places.</span>
                </h2>
                <p>Open any of them and get on with it — each one is a full page.</p>
              </div>
              <div className="feature-list">
                {services.map((service, index) => (
                  <LandingLink className="feature-row" to={service.to} key={service.title}>
                    <span className="feature-no">{String(index + 1).padStart(2, "0")}</span>
                    <span className="feature-icon">
                      <service.icon size={19} />
                    </span>
                    <span className="feature-copy">
                      <strong>{service.title}</strong>
                      <small>{service.description}</small>
                    </span>
                    <span className="feature-note">{service.note}</span>
                    <ArrowUpRight className="feature-arrow" size={17} />
                  </LandingLink>
                ))}
              </div>
              <div className="services-foot">
                <span>STUDENT SERVICES</span>
                <span>UNIMARKY</span>
              </div>
            </section>

            <section className="closing-section" id="signup">
              <span className="closing-eyebrow">
                <i /> FOR STUDENTS
              </span>
              <h2>
                Find what you need
                <br />
                <span>on campus.</span>
              </h2>
              <p>Start exploring Unimarky.</p>
              <LandingLink className="button button-primary" to="/auth">
                Get started <ArrowRight size={15} />
              </LandingLink>
              <span className="closing-coordinate">UNIMARKY</span>
            </section>

            <section className="faq-strip" id="faqs">
              <SectionLabel number="08">FAQs</SectionLabel>
              <div>
                <h2>Questions?</h2>
                <p>Short answers about using Unimarky.</p>
                <div className="faq-list">
                  {faqs.map((faq) => (
                    <details className="faq-item" key={faq.question}>
                      <summary>
                        {faq.question}
                        <Plus size={15} />
                      </summary>
                      <p>{faq.answer}</p>
                    </details>
                  ))}
                </div>
                <LandingLink className="text-link" to="/contact">
                  Still stuck? Contact us <ArrowRight size={15} />
                </LandingLink>
              </div>
            </section>
          </div>

          <SiteFooter />
        </main>
      </div>
    </div>
  );
}
