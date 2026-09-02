import { HeroSection } from "./components/HeroSection";
import { ConnectedEcosystemSection } from "./components/ConnectedEcosystemSection";
import { WhyUnimarkySection } from "./components/WhyUnimarkySection";
import { CampusNetworkSection } from "./components/CampusNetworkSection";
import { CommunitySection } from "./components/CommunitySection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function LandingPage() {
    return (
        <div className="relative min-h-screen bg-[#FFFCF8] font-sans selection:bg-[#FFE1D2] selection:text-[#FF5A36]">
            <Navbar showScrollLinks={true} />
            {/* Main content sits with z-10 above the sticky footer */}
            <main className="relative z-10 bg-[#FFFCF8] shadow-[0_20px_60px_rgba(36,50,74,0.06)]">
                <HeroSection />
                <ConnectedEcosystemSection />
                <WhyUnimarkySection />
                <CampusNetworkSection />
                <CommunitySection />
            </main>
            {/* Sticky footer reveals naturally as user reaches the end of the scroll */}
            <Footer />
        </div>
    );
}
