// src/app/contact/page.tsx
import ContactSection from '@/components/sections/ContactSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us | Menjangan Dive Center",
  description: "Get in touch with us to book your next diving adventure or to ask any questions. We're here to help!",
};

export default function ContactPage() {
  return (
    <div className="pt-24">
      <ContactSection />
    </div>
  );
}