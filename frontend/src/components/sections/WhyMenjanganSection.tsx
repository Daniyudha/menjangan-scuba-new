// src/components/sections/WhyMenjanganSection.tsx
"use client";

import { Gem, Waves, Eye, Leaf } from 'lucide-react';
import { content } from '@/lib/content'; // Langsung import

// Hapus referensi ke 'lang' karena sudah single-language
// import { Language } from '@/app/page';

const icons = [Gem, Waves, Eye, Leaf];

// Hapus props 'lang' dari definisi komponen
const WhyMenjanganSection = () => {
  // Ambil data langsung dari objek content yang sudah disederhanakan
  const sectionContent = content.whyMenjangan;

  return (
    // 'id' di sini opsional karena kita sudah beralih ke navigasi multi-halaman
    <section id="why" className="py-20 bg-navy">
      <div className="container mx-auto px-6">
        {/* Mengubah layout judul agar lebih konsisten */}
        <div className="text-center md:text-left mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {sectionContent.title}
          </h2>
          <p className="max-w-3xl mt-4 text-slate">
            {sectionContent.subtitle}
          </p>
        </div>
        
        {/* Grid untuk fitur-fitur unggulan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {sectionContent.features.map((feature, index) => {
            const Icon = icons[index];
            return (
              <div 
                key={index} 
                className="bg-dark-navy p-8 rounded-2xl text-left transform hover:-translate-y-2 transition-transform duration-300 hover:shadow-lg hover:shadow-black/20"
              >
                <Icon className="w-10 h-10 text-bright-blue mb-4" />
                <h3 className="text-xl font-bold text-light-slate mb-2">{feature.title}</h3>
                <p className="text-slate text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyMenjanganSection;