import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import TrackingSection from '@/components/TrackingSection';
import StatsSection from '@/components/StatsSection';
import CtaSection from '@/components/CtaSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      <HeroSection />
      <TrackingSection />
      <FeaturesSection />
      <StatsSection />
      <CtaSection />
    </div>
  );
}