import { HeroSection } from "./components/HeroSection";
import { EcosystemSection } from "./components/EcosystemSection";
import { CommunitySection } from "./components/CommunitySection";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function LandingPage() {
    return (
        <div className="bg-background min-h-screen">
            <Navbar showScrollLinks={true} />
            <HeroSection />
            <EcosystemSection />
            <CommunitySection />
            <Footer />
        </div>
    );
}
