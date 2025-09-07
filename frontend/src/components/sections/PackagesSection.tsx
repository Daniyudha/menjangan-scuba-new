// src/components/sections/PackagesSection.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import { Check } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Tipe data untuk paket dari API
interface Package {
  id: string;
  title: string;
  price: string;
  description: string;
  inclusions: string[];
  imageUrl: string | null;
}

export default function PackagesSection() {
    // State untuk data, loading, dan error
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

    useEffect(() => {
        const fetchPackages = async () => {
            try {
                const data: Package[] = await apiClient('/packages');
                setPackages(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchPackages();
    }, []);

    if (loading) {
        return (
            <section id="packages" className="py-20 bg-navy">
                <div className="container mx-auto px-6 text-center">
                    <div className="h-10 bg-dark-navy/50 rounded-md w-1/2 mx-auto mb-4 animate-pulse"></div>
                    <div className="h-6 bg-dark-navy/50 rounded-md w-2/3 mx-auto mb-12 animate-pulse"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        <div className="h-[28rem] bg-dark-navy/50 rounded-2xl animate-pulse"></div>
                        <div className="h-[28rem] bg-dark-navy/50 rounded-2xl animate-pulse"></div>
                        <div className="h-[28rem] bg-dark-navy/50 rounded-2xl animate-pulse"></div>
                        <div className="h-[28rem] bg-dark-navy/50 rounded-2xl animate-pulse"></div>
                    </div>
                </div>
            </section>
        );
    }

    if (error || packages.length === 0) {
        // Jangan render section sama sekali jika ada error atau tidak ada data
        return null;
    }

    return (
        <section id="packages" className="py-20 bg-navy">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    Choose Your Underwater Adventure
                </h2>
                <p className="max-w-2xl mx-auto mb-12 text-slate">
                    We offer a variety of packages to meet the needs of every adventurer.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="relative h-[28rem] w-full rounded-2xl overflow-hidden group shadow-lg shadow-black/30"
                        >
                            {/* Gunakan imageUrl dari database */}
                            {pkg.imageUrl && (
                                <Image
                                    src={`${baseUrl}${pkg.imageUrl}`}
                                    alt={pkg.title}
                                    layout="fill"
                                    objectFit="cover"
                                    className="rounded-2xl group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                />
                            )}
                            
                            <div className="absolute inset-0 bg-black/60 rounded-2xl" />

                            <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center text-white transition-all duration-500 ease-in-out md:group-hover:justify-start md:group-hover:pt-8">
                                <div className="text-center">
                                    <h3 className="text-2xl font-bold">{pkg.title}</h3>
                                    <p className="text-lg font-semibold text-bright-blue mt-1">{pkg.price}</p>
                                </div>

                                <div className="w-full mt-4 transition-opacity duration-300 delay-200 sm:block lg:opacity-0 lg:group-hover:opacity-100">
                                    <p className="text-gray-400 text-left text-sm">
                                        {pkg.description}
                                    </p>
                                    <ul className="space-y-2 mt-4 text-gray-400 text-left">
                                        {pkg.inclusions.map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <Check className="w-4 h-4 text-bright-blue flex-shrink-0" />
                                                <span className="text-sm">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            <a
                                href="/contact" // Arahkan ke halaman kontak
                                className="absolute z-1 left-1/2 -translate-x-1/2 text-white hover:text-blue-400 hover:underline text-center transition-all duration-300 ease-in-out bottom-8 md:group-hover:bottom-6"
                            >
                                Book Now
                            </a>

                            <div className="absolute inset-2 border-2 border-white rounded-xl group-hover:opacity-100 transition-opacity duration-500" />

                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};