// src/app/about/page.tsx
import AboutUsSection from '@/components/sections/AboutUsSection';
import TestimonialsSection from '@/components/sections/TestimonialsSection'; // Testimoni relevan di halaman 'About'
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us | Menjangan Dive Center",
  description: "Learn about our commitment to safety, our expert guides, and why we are the top choice for scuba diving in Menjangan, Bali.",
};

export default function AboutPage() {
  return (
    <div className="pt-24">
      <AboutUsSection />
      <TestimonialsSection />
    </div>
  );
}