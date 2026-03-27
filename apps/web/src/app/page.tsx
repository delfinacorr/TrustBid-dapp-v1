import { Navbar } from "../components/landing/Navbar";
import { Hero } from "../components/landing/Hero";
import { ContentSection } from "../components/landing/ContentSection";
import { StatementSection } from "../components/landing/StatementSection";
import { Footer } from "../components/landing/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-trust-black selection:bg-trust-blue selection:text-white">
      <Navbar />
      <Hero />
      <ContentSection />
      <StatementSection />
      <Footer />
    </main>
  );
}
