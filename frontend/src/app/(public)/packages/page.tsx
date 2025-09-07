// src/app/packages/page.tsx
import PackagesSection from '@/components/sections/PackagesSection';
import FaqSection from '@/components/sections/FaqSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Dive Packages | Menjangan Dive Center",
  description: "Choose from our daily dive trips, free diving, PADI open water courses, and snorkeling packages in Menjangan Island, Bali.",
};

export default function PackagesPage() {
  return (
    <div className="pt-24"> {/* Padding atas agar konten tidak tertutup header fixed */}
      <PackagesSection />
      <FaqSection />
    </div>
  );
}