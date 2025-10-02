// src/components/sections/TestimonialsSection.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/pagination';

// 1. Perbarui interface agar cocok dengan skema Prisma
interface Testimonial {
  id: string;
  name: string;
  quote: string;
  isFeatured: boolean;
  origin: string | null; // Tambahkan origin
  avatarUrl: string | null; // Pastikan ini ada
}

export default function TestimonialsSection() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const response = await apiClient('/testimonials');
                const allTestimonials: Testimonial[] = Array.isArray(response.data) ? response.data : [];

                const featuredTestimonials = allTestimonials.filter(t => t.isFeatured);

                if (featuredTestimonials.length > 0) {
                    setTestimonials(featuredTestimonials);
                } else {
                    setTestimonials(allTestimonials.slice(0, 3));
                }
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    if (loading || error || testimonials.length === 0) {
        return null;
    }

    return (
        <section id="testimonials" className="py-20 bg-dark-navy">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
                        What Our Divers Say
                    </h2>
                    <p className="max-w-2xl mx-auto mt-4 text-slate">
                        Hear from adventurers who have explored the depths with us.
                    </p>
                </div>

                <Swiper 
                    modules={[Pagination, Autoplay]} 
                    spaceBetween={30} 
                    slidesPerView={1} 
                    pagination={{ clickable: true }} 
                    autoplay={{ delay: 6000 }} 
                    loop={testimonials.length > 1}
                    className="pb-16"
                >
                    {testimonials.map((testimonial) => (
                        <SwiperSlide key={testimonial.id} className="bg-navy p-8 md:p-12 rounded-2xl">
                            <div className="flex flex-col items-center text-center">
                                {/* 2. Logika src gambar yang diperbarui */}
                                <div className="rounded-full mb-6 border-2 border-bright-blue overflow-hidden w-24 h-24 bg-dark-navy">
                                    <Image
                                        src={testimonial.avatarUrl ? `${baseUrl}${testimonial.avatarUrl}` : `https://i.pravatar.cc/96?u=${testimonial.id}`}
                                        alt={testimonial.name}
                                        width={96}
                                        height={96}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                                <p className="italic text-xl md:text-2xl text-light-slate max-w-3xl mx-auto mb-6">
                                    &quot;{testimonial.quote}&quot;
                                </p>
                                <h4 className="font-bold text-white text-xl">{testimonial.name}</h4>
                                
                                {/* 3. Tampilkan 'origin' jika ada */}
                                {testimonial.origin && (
                                    <p className="text-slate mt-1">{testimonial.origin}</p>
                                )}
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};