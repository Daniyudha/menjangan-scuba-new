import type { Metadata } from 'next';

import HeroSection from '@/components/sections/HeroSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import ActivitiesSection from '@/components/sections/ActivitiesSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection';

export const metadata: Metadata = {
  title: "Menjangan Scuba | Bali's Underwater Paradise",
  description: "Explore spectacular reefs with Menjangan Scuba. We offer certified dive courses, daily trips, and unforgettable sea adventures in Bali.",
};

export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSection />
      <ExperienceSection />
      <ActivitiesSection />
      <TestimonialsSection />
    </div>
  );
}