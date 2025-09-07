"use client";
import Header from '@/components/sections/Header';
import Footer from '@/components/sections/Footer';
import BackToTopButton from '@/components/common/BackToTopButton';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
      <BackToTopButton />
    </>
  );
}