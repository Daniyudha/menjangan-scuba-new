// src/components/sections/HeroSection.tsx
"use client"; // <-- PERBAIKAN UTAMA: Gunakan spasi, bukan tanda hubung

import { apiClient } from '@/lib/apiClient';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import CSS untuk Swiper
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Tipe data untuk slide hero dari API
interface HeroSlide {
  id: string;
  headline: string;
  subheadline: string;
  cta: string;
  imageUrl: string;
}

export default function HeroSection() {
    const [slides, setSlides] = useState<HeroSlide[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

    useEffect(() => {
        const fetchHeroData = async () => {
            try {
                const settings = await apiClient('/settings');
                if (Array.isArray(settings.hero)) {
                    setSlides(settings.hero);
                } else {
                    throw new Error("Invalid hero data format from API.");
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchHeroData();
    }, []);

    if (loading) {
        return (
            <section id="home" className="relative h-screen w-full bg-dark-navy flex items-center justify-center">
                <p className="text-white animate-pulse">Loading Slides...</p>
            </section>
        );
    }

    if (error) {
        return (
            <section id="home" className="relative h-screen w-full bg-dark-navy flex items-center justify-center">
                <p className="text-red-400">Error: {error}</p>
            </section>
        );
    }
    
    return (
        <section id="home" className="relative h-screen w-full">
            <Swiper
                modules={[Navigation, Pagination, Autoplay, EffectFade]}
                spaceBetween={0}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                effect="fade"
                loop={true}
                className="h-full w-full"
            >
                {slides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-full w-full">
                            <Image
                                src={`${baseUrl}${slide.imageUrl}`}
                                alt={slide.headline}
                                layout="fill"
                                objectFit="cover"
                                className="brightness-50"
                                priority={index === 0}
                            />
                           
                            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center text-white p-6">
                                 <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.headline}</h1>
                                <p className="text-lg md:text-xl max-w-3xl mb-8">{slide.subheadline}</p>
                                <a href="#packages" className="text-white bg-light-navy rounded-full font-bold py-3 px-8 transition duration-500">
                                    {slide.cta}
                                </a>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};