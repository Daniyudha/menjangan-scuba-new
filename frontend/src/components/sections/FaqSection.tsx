// src/components/sections/FaqSection.tsx
"use client";

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react'; 
import { content } from '@/lib/content'; // Langsung import

// Hapus referensi ke 'lang' dan 'Language'
// import { Language } from '@/app/page';

// Komponen FaqItem tidak perlu diubah karena sudah mandiri
const FaqItem = ({ q, a }: { q: string; a: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-light-navy/20">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center py-6 text-left"
            >
                <h4 className="text-lg font-semibold text-light-slate">{q}</h4>
                <div className="text-bright-blue"> {/* Mengubah warna ikon agar lebih menonjol */}
                  {isOpen ? <Minus size={24} /> : <Plus size={24} />}
                </div>
            </button>
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                  <p className="pb-6 pr-8 text-slate">{a}</p>
                </div>
            </div>
        </div>
    );
};

// Hapus props 'lang' dari definisi komponen
const FaqSection = () => {
    // Ambil data langsung dari objek content yang sudah disederhanakan
    const sectionContent = content.faq;

    return (
        <section id="faq" className="py-20 bg-navy">
            <div className="container mx-auto px-6 max-w-4xl">
                {/* Judul dan subjudul sekarang dinamis dari content.ts */}
                <div className="text-center md:text-left mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white">
                        {sectionContent.title}
                    </h2>
                    <p className="max-w-2xl mt-4 text-slate">
                        {sectionContent.subtitle}
                    </p>
                </div>
                <div className="space-y-2">
                    {sectionContent.items.map((item, index) => (
                        <FaqItem key={index} q={item.q} a={item.a} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FaqSection;