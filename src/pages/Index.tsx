
import { HeroSection } from "@/components/HeroSection";
import { Navbar } from "@/components/Navbar";
import { FeaturesSection } from "@/components/FeaturesSection";
import { RolesSection } from "@/components/RolesSection";
import { WorkflowSection } from "@/components/WorkflowSection";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <RolesSection />
        <WorkflowSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
