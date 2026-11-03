import Hero from "@/components/Hero";
import PowerfulFeatures from "@/components/PowerfulFeatures";
import FeaturedPhotography from "@/components/FeaturedPhotography";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* 1. Hero Section matching Top-Left Mockup */}
      <Hero />

      {/* 2. Powerful Features Showcase matching Bottom-Right Mockup */}
      <div id="features-section">
        <PowerfulFeatures />
      </div>

      {/* 3. Curated Featured Photography */}
      <FeaturedPhotography />
    </main>
  );
}
