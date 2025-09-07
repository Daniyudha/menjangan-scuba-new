// src/app/(public)/gallery/page.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import Image from 'next/image';
import { useEffect, useState } from 'react';
// 1. Impor komponen Lightbox dan CSS-nya
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

// Tipe data
interface GalleryImage { id: string; url: string; caption: string; category: string; }
interface GalleryCategory { id: string; name: string; }

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    
    // --- 2. State baru untuk mengontrol Lightbox ---
    const [lightboxIndex, setLightboxIndex] = useState(-1);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil gambar dan kategori secara bersamaan
                const [imagesData, categoriesData] = await Promise.all([
                    apiClient('/gallery/images'),
                    apiClient('/gallery/categories')
                ]);
                setImages(imagesData);
                setCategories(categoriesData);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally { 
                setLoading(false); 
            }
        };
        fetchData();
    }, []);
    
    // Logika untuk memfilter gambar berdasarkan kategori yang aktif
    const filteredImages = activeCategory === 'All' 
        ? images 
        : images.filter(img => img.category === activeCategory);

    const lightboxSlides = filteredImages.map(img => ({
        src: `${baseUrl}${img.url}`
    }));

    return (
        <div className="pt-24 pb-20 bg-dark-navy min-h-screen">
            <div className="container mx-auto px-6">
                {/* Header Halaman */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">Our Gallery</h1>
                    <p className="mt-4 text-slate max-w-2xl mx-auto">
                        A glimpse into the stunning underwater world of Menjangan Island and the adventures we share.
                    </p>
                </div>

                {/* Filter Kategori */}
                <div className="flex justify-center flex-wrap gap-2 md:gap-4 mb-12">
                    <button 
                        onClick={() => setActiveCategory('All')}
                        className={`px-4 py-2 text-sm font-semibold text-state rounded-full transition-colors cursor-pointer ${
                            activeCategory === 'All' 
                            ? 'bg-light-navy text-white' 
                            : 'bg-navy text-white'
                        }`}
                    >
                        All
                    </button>
                    {categories.map(cat => (
                         <button 
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.name)}
                            className={`px-4 py-2 text-sm font-semibold text-state rounded-full transition-colors cursor-pointer ${
                                activeCategory === cat.name 
                                ? 'bg-light-navy text-white' 
                                : 'bg-navy text-white'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Tampilan Loading atau Error */}
                {loading && <p className="text-center text-slate animate-pulse">Loading images...</p>}
                {error && <p className="text-center text-red-400">Error: {error}</p>}
                
                {/* Grid Gambar */}
                {!loading && !error && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredImages.map((img, index) => (
                            // --- 4. Bungkus gambar dengan tombol untuk membuka Lightbox ---
                            <button 
                                key={img.id} 
                                className="relative aspect-square group overflow-hidden rounded-lg block w-full"
                                onClick={() => setLightboxIndex(index)}
                            >
                                <Image 
                                    src={`${baseUrl}${img.url}`} 
                                    alt={img.caption} 
                                    layout="fill"
                                    objectFit="cover"
                                    className="group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-0 left-0 p-4">
                                        <p className="text-white font-semibold text-left">{img.caption}</p>
                                        <p className="text-xs text-bright-blue text-left">{img.category}</p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                
                {/* Pesan jika tidak ada gambar */}
                {!loading && filteredImages.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate">No images found in this category.</p>
                    </div>
                )}
            </div>

            <Lightbox
                open={lightboxIndex >= 0}
                index={lightboxIndex}
                close={() => setLightboxIndex(-1)}
                slides={lightboxSlides}
            />
        </div>
    );
}