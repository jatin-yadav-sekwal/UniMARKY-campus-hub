import type { ReactNode } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useReducedMotion } from "motion/react";
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
  Utensils,
  Users,
} from "lucide-react";
import brandMark from "@/assets/brand-mark.svg";
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
        <span className="map-coordinate coord-one">51°30&apos;26.4&quot;N</span>
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

  return (
    <div className="um-landing">
      <div className="atmosphere" aria-hidden="true">
        <div className="atmosphere-diffusion" />
        <div className="atmosphere-fade" />
      </div>

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
                    Find campus communities, study support, accommodation and food in one
                    place.
                  </p>
                  <div className="hero-actions">
                    <LandingLink className="button button-primary" to="/#ecosystem">
                      Explore the ecosystem <ArrowRight size={15} />
                    </LandingLink>
                    <LandingLink className="button button-secondary" to="/about">
                      About the platform
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
                    Find the resources you need for study, housing, food and student life.
                  </p>
                  <LandingLink className="text-link" to="/#integration">
                    Explore the platform <ArrowRight size={15} />
                  </LandingLink>
                </div>
              </div>
              <div className="intro-index">
                <span>STUDENT SERVICES</span>
                <span>UNIMARKY</span>
              </div>
            </section>

            <section className="discover-section" id="marketplace">
              <SectionLabel number="02">Marketplace &amp; resources</SectionLabel>
              <div className="discover-heading">
                <h2>
                  Explore what&apos;s
                  <br />
                  <span>around campus.</span>
                </h2>
                <p>Browse student services and useful campus resources.</p>
              </div>
              <div className="feature-list">
                <LandingLink className="feature-row" to="/communities">
                  <span className="feature-no">01</span>
                  <span className="feature-icon">
                    <Users size={19} />
                  </span>
                  <span className="feature-copy">
                    <strong>Community</strong>
                    <small>Find student groups and campus events.</small>
                  </span>
                  <span className="feature-note">PEOPLE &amp; PLACES</span>
                  <ArrowUpRight className="feature-arrow" size={17} />
                </LandingLink>
                <LandingLink className="feature-row" to="/study">
                  <span className="feature-no">02</span>
                  <span className="feature-icon">
                    <BookOpen size={19} />
                  </span>
                  <span className="feature-copy">
                    <strong>Study</strong>
                    <small>Browse study resources and learning spaces.</small>
                  </span>
                  <span className="feature-note">LEARN AT YOUR PACE</span>
                  <ArrowUpRight className="feature-arrow" size={17} />
                </LandingLink>
                <LandingLink className="feature-row" to="/housing">
                  <span className="feature-no">03</span>
                  <span className="feature-icon">
                    <Building2 size={19} />
                  </span>
                  <span className="feature-copy">
                    <strong>Accommodation</strong>
                    <small>Explore student accommodation options.</small>
                  </span>
                  <span className="feature-note">A PLACE TO LAND</span>
                  <ArrowUpRight className="feature-arrow" size={17} />
                </LandingLink>
                <LandingLink className="feature-row" to="/food">
                  <span className="feature-no">04</span>
                  <span className="feature-icon">
                    <Utensils size={19} />
                  </span>
                  <span className="feature-copy">
                    <strong>Food</strong>
                    <small>Find food options around campus.</small>
                  </span>
                  <span className="feature-note">GOOD THINGS NEARBY</span>
                  <ArrowUpRight className="feature-arrow" size={17} />
                </LandingLink>
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
                <p>Explore student groups, events and ways to connect with other students.</p>
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
                  <p>Browse study resources and find spaces to work between classes.</p>
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
                <p>Browse accommodation options and find a place near your university.</p>
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
                <p>Browse cafés, dining halls and food options near campus.</p>
                <LandingLink className="text-link" to="/food">
                  See what&apos;s nearby <ArrowRight size={15} />
                </LandingLink>
              </div>
            </section>

            <section className="integration-section" id="integration">
              <SectionLabel number="07">Integration</SectionLabel>
              <div className="integration-row">
                <h2>
                  Campus services,
                  <br />
                  <span>in one place.</span>
                </h2>
                <div>
                  <p>Explore student resources for study, housing, food and community.</p>
                  <LandingLink className="button button-secondary" to="/about">
                    Learn more <ArrowRight size={15} />
                  </LandingLink>
                </div>
              </div>
              <div className="integration-foot">
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
                <p>Contact us for more information about Unimarky.</p>
                <LandingLink className="text-link" to="/contact">
                  Contact Unimarky <ArrowRight size={15} />
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
