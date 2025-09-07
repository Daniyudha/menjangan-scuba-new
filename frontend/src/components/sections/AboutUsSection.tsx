// src/components/sections/AboutUsSection.tsx
"use client";

import { content } from '@/lib/content'; // Langsung import
import { Award, ShieldCheck, Sprout, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Karena kita sudah beralih ke single-language, kita hapus referensi ke 'lang'
// import { Language } from '@/app/page';

const icons = [Award, ShieldCheck, Tag, Sprout];

// Pastikan path gambar ini benar di dalam folder /public Anda
const imageUrl1 = "/images/about-3.jpg";
const imageUrl2 = "/images/about-1.jpg";

const AboutUsSection = () => { // Hapus props 'lang'
    // Ambil data langsung dari objek content
    const sectionContent = content.about;
    // const navContent = content.nav; // Untuk teks tombol yang konsisten

    return (
        <section id="about" className="py-20 bg-navy">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Kolom Kiri: Teks dan Fitur */}
                    <div className="flex flex-col gap-6">
                        <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                            {sectionContent.title}
                        </h2>
                        <p className="text-slate max-w-lg">
                            {sectionContent.subtitle}
                        </p>
                        {/* Grid 2x2 untuk fitur, sekarang dengan deskripsi */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mt-6">
                            {sectionContent.values.map((value, index) => {
                                const Icon = icons[index];
                                return (
                                    <div key={index} className="flex items-start gap-4">
                                        <Icon className="w-8 h-8 text-bright-blue flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-light-slate">{value.title}</h3>
                                            <p className="text-slate text-sm mt-1">{value.description}</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <Link
                            href="/contact" // Arahkan ke halaman kontak
                            className="bg-light-navy text-white py-2 px-6 rounded-lg hover:bg-light-navy/80 transition duration-400 mt-8 max-w-max hidden lg:block"
                        >
                            Contact Us
                        </Link>
                    </div>

                    {/* Kolom Kanan: Gambar dan Tombol (Struktur Disederhanakan) */}
                    {/* Cukup satu grid dengan dua kolom */}
                    <div className="grid grid-cols-2 gap-6">

                        {/* Gambar 1 (kiri) dengan Tombol */}
                        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
                            <Image
                                src={imageUrl1}
                                alt="School of orange fish"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-2xl"
                            />
                        </div>

                        {/* Gambar 2 (kanan) dengan sedikit offset ke atas */}
                        <div className="relative w-full h-[500px] rounded-2xl overflow-hidden self-start mt-[-4rem]lg:self-auto lg:mt-8">
                            <Image
                                src={imageUrl2}
                                alt="Snorkelers from an aerial view"
                                layout="fill"
                                objectFit="cover"
                                className="rounded-2xl"
                            />
                        </div>

                    </div>

                </div>
                <Link
                    href="/contact" // Arahkan ke halaman kontak
                    className="bg-light-navy text-white py-2 px-6 rounded-lg hover:bg-light-navy/80 transition duration-400 flex justify-center items-center mt-8 max-w-max mx-auto lg:hidden"
                >
                    Contact Us
                </Link>
            </div>
        </section>
    );
};

export default AboutUsSection;