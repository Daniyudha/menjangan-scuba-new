// src/components/sections/Header.tsx
"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Fish, Menu, X } from 'lucide-react';
import { content } from '@/lib/content';
import Link from 'next/link';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const navContent = content.nav;

  const navLinks = [
    { href: '/', label: navContent.home },
    { href: '/packages', label: 'Packages' },
    { href: '/testimonials', label: navContent.testimonials },
    { href: '/gallery', label: 'Gallery' },
    { href: '/articles', label: 'Articles' },
    { href: '/about', label: navContent.about },
    { href: '/contact', label: 'Contact' },
  ];

  // Efek untuk mendeteksi scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-in-out ${isScrolled || isOpen
        ? 'bg-none'
        : 'bg-transparent'
        }`}
    >
      <div className={`container mx-auto px-6 py-4 flex justify-between items-center ${isScrolled || isOpen
        ? 'bg-white my-2 rounded-full shadow-lg transition-all duration-700 ease-in-out'
        : 'bg-transparent transition-all duration-700 ease-in-out'
        }`}
      >
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center gap-1">
            <span className={`text-xl font-black text-white" ${isScrolled || isOpen
              ? 'text-black'
              : 'text-xl font-black text-white'
              }`}
            >
              MENJANGAN
            </span>
            <Fish className="w-5 h-5 text-bright-blue transform -rotate-45" />
            <span className={`text-xl font-black text-white" ${isScrolled || isOpen
              ? 'text-black'
              : 'text-xl font-black text-white'
              }`}
            >
              SCUBA
            </span>
          </div>
        </Link>

        {/* Navigasi Desktop */}
        <nav className="hidden lg:flex items-center space-x-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;

            // --- TEMPLATE BARU DENGAN 4 KONDISI ---

            const baseClasses = "transition-all duration-700 font-medium py-2";
            let dynamicClasses = '';

            if (isActive) {
              // KONDISI 1 & 2: Link sedang aktif
              if (isScrolled) {
                // Gaya saat AKTIF dan halaman di-scroll (header solid)
                dynamicClasses = "text-light-navy font-bold border-b-2 border-light-navy";
              } else {
                // Gaya saat AKTIF dan halaman di paling atas (header transparan)
                dynamicClasses = "text-white font-bold border-b-2 border-white";
              }
            } else {
              // KONDISI 3 & 4: Link sedang tidak aktif
              if (isScrolled) {
                // Gaya saat TIDAK AKTIF dan halaman di-scroll (header solid)
                dynamicClasses = "text-light-slate hover:text-blue-400";
              } else {
                // Gaya saat TIDAK AKTIF dan halaman di paling atas (header transparan)
                dynamicClasses = "text-gray-200 hover:text-white";
              }
            }

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${baseClasses} ${dynamicClasses}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Tombol Aksi di Desktop (tanpa tombol bahasa) */}
        <div className="hidden lg:flex">
          <Link href="/contact" className="bg-light-navy text-white rounded-full px-8 py-2 transision duration-300">
            {navContent.bookNow}
          </Link>
        </div>

        {/* Tombol Hamburger di Mobile */}
        <div className="lg:hidden">
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            // Tambahkan kelas dinamis untuk warna teks
            className={`z-50 relative transition-colors duration-300 ${
                isScrolled || isOpen ? 'text-black' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="text-white" size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div >

      {/* Menu Dropdown Mobile */}
      {
        isOpen && (
          <div className="lg:hidden fixed top-0 left-0 w-full h-screen bg-dark-navy flex flex-col items-center justify-center space-y-8">
            <nav className="flex flex-col items-center space-y-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-2xl ${pathname === link.href ? 'text-white font-bold' : 'text-light-slate'}`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <Link
              href="/contact"
              className="bg-light-navy text-white rounded-full px-8 py-3 mt-8 transision duration-300"
              onClick={() => setIsOpen(false)}
            >
              {navContent.bookNow}
            </Link>
          </div>
        )
      }
    </header >
  );
};

export default Header;