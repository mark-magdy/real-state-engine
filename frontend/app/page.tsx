import { HeroSection, FeatureShowcase, CTASection } from '@/features/landing';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Find Your Next Investment | REI Engine',
  description: 'Analyze real estate investment opportunities and find the best property deals from multiple platforms in one unified search.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeatureShowcase />
      <CTASection />
    </>
  );
}
