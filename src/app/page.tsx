import Nav from "@/components/marketing/Nav";
import Hero from "@/components/marketing/Hero";
import TrustBar from "@/components/marketing/TrustBar";
import Problem from "@/components/marketing/Problem";
import Platform from "@/components/marketing/Platform";
import Features from "@/components/marketing/Features";
import Personas from "@/components/marketing/Personas";
import Workflow from "@/components/marketing/Workflow";
import MidCTA from "@/components/marketing/MidCTA";
import Impact from "@/components/marketing/Impact";
import FinalCTA from "@/components/marketing/FinalCTA";
import Footer from "@/components/marketing/Footer";

export default function HomePage() {
  return (
    <main id="main-content" className="bg-[#09090B]">
      <Nav />
      <Hero />
      <TrustBar />
      <Problem />
      <Platform />
      <Features />
      <Personas />
      <Workflow />
      <MidCTA />
      <Impact />
      <FinalCTA />
      <Footer />
    </main>
  );
}
