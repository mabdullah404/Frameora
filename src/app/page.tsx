import Hero from "@/components/Hero";
import FeaturedPhotography from "@/components/FeaturedPhotography";
import StoriesSection from "@/components/StoriesSection";
import PowerfulFeatures from "@/components/PowerfulFeatures";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Curated Featured Photography Showcase */}
      <FeaturedPhotography />

      {/* 3. Visual Journal & Photo Essays */}
      <StoriesSection />

      {/* 4. Powerful Features & Platform Architecture */}
      <div id="features-section">
        <PowerfulFeatures />
      </div>
    </main>
  );
}
