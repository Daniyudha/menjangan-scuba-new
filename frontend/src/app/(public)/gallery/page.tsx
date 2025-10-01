// src/app/(public)/gallery/page.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

// Tipe data
interface GalleryImage { id: string; url: string; caption: string; category: string; createdAt: string; }
interface GalleryVideo { id: string; youtubeUrl: string; caption: string; category: string; createdAt: string; }
interface GalleryCategory { id: string; name: string; }

type GalleryItem = GalleryImage | GalleryVideo;

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [videos, setVideos] = useState<GalleryVideo[]>([]);
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    
    // --- 2. State baru untuk mengontrol Lightbox ---
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    
    // Swipe detection for navigation
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);
    const isDragging = useRef(false);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Ambil gambar, video, dan kategori secara bersamaan
                const [imagesData, videosData, categoriesData] = await Promise.all([
                    apiClient('/gallery/images'),
                    apiClient('/gallery/videos'),
                    apiClient('/gallery/categories')
                ]);
                setImages(imagesData);
                setVideos(videosData);
                setCategories(categoriesData);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    
    // Fungsi untuk mendapatkan ID video YouTube dari URL
    const getYouTubeVideoId = (url: string): string | null => {
        const match = url.match(/(?:youtube\.com\/shorts\/|youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
        return match ? match[1] : null;
    };

    // Fungsi untuk mendeteksi tipe video (short atau regular)
    const getYouTubeVideoType = (url: string): 'short' | 'video' => {
        if (url.includes('youtube.com/shorts/')) {
            return 'short';
        }
        return 'video';
    };

    // Gabungkan gambar dan video menjadi satu array dan urutkan berdasarkan tanggal dibuat
    const allItems: GalleryItem[] = [...images, ...videos].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Filter item berdasarkan kategori yang aktif
    const filteredItems = activeCategory === 'All'
        ? allItems
        : allItems.filter(item => item.category === activeCategory);


    // Swipe handlers - defined after filteredItems is available
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        touchStartX.current = e.touches[0].clientX;
        isDragging.current = true;
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (!isDragging.current) return;
        e.preventDefault();
        touchEndX.current = e.touches[0].clientX;
    }, []);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging.current || !touchStartX.current || !touchEndX.current || filteredItems.length <= 1) return;
        
        const diffX = touchEndX.current - touchStartX.current;
        const swipeThreshold = 30; // Reduced threshold for easier triggering

        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // Swipe right - go to previous item
                setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredItems.length) % filteredItems.length);
            } else {
                // Swipe left - go to next item
                setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
            }
        }

        // Reset values
        touchStartX.current = 0;
        touchEndX.current = 0;
        isDragging.current = false;
    }, [filteredItems.length]);

    // Mouse drag handlers for swipe simulation (element-based)
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        touchStartX.current = e.clientX;
        isDragging.current = true;
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        if (!isDragging.current) return;
        e.preventDefault();
        touchEndX.current = e.clientX;
    }, []);

    const handleMouseUp = useCallback(() => {
        if (!isDragging.current || !touchStartX.current || !touchEndX.current || filteredItems.length <= 1) return;
        
        const diffX = touchEndX.current - touchStartX.current;
        const swipeThreshold = 30; // Reduced threshold for easier triggering

        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // Drag right - go to previous item
                setCurrentIndex((prevIndex) => (prevIndex - 1 + filteredItems.length) % filteredItems.length);
            } else {
                // Drag left - go to next item
                setCurrentIndex((prevIndex) => (prevIndex + 1) % filteredItems.length);
            }
        }

        // Reset values
        touchStartX.current = 0;
        touchEndX.current = 0;
        isDragging.current = false;
    }, [filteredItems.length]);

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
                
                {/* Masonry Grid untuk Gambar dan Video */}
                {!loading && !error && (
                    <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
                        {filteredItems.map((item, index) => (
                            <div key={item.id} className="break-inside-avoid mb-6">
                                {'url' in item ? (
                                    // Render Gambar
                                    <button
                                        className="relative group overflow-hidden rounded-lg block w-full"
                                        onClick={() => {
                                            const index = filteredItems.findIndex(i => i.id === item.id);
                                            setCurrentIndex(index);
                                            setLightboxOpen(true);
                                        }}
                                    >
                                        <Image
                                            src={`${baseUrl}${item.url}`}
                                            alt={item.caption}
                                            width={400}
                                            height={400}
                                            className="w-full h-auto group-hover:scale-110 transition-transform duration-500 ease-in-out"
                                            unoptimized={true}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 p-4">
                                                <p className="text-white font-semibold text-left">{item.caption}</p>
                                                <p className="text-xs text-bright-blue text-left">{item.category}</p>
                                            </div>
                                        </div>
                                    </button>
                                ) : (
                                    // Render Video YouTube
                                    <button
                                        className="relative group overflow-hidden rounded-lg block w-full"
                                        onClick={() => {
                                            const index = filteredItems.findIndex(i => i.id === item.id);
                                            setCurrentIndex(index);
                                            setLightboxOpen(true);
                                        }}
                                    >
                                        <div className="w-full" style={{ aspectRatio: getYouTubeVideoType(item.youtubeUrl) === 'short' ? '9/16' : '16/9' }}>
                                            <iframe
                                                src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.youtubeUrl)}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${getYouTubeVideoId(item.youtubeUrl)}`}
                                                title={item.caption}
                                                className="w-full h-full rounded-lg"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="absolute bottom-0 left-0 p-4">
                                                <p className="text-white font-semibold text-left">{item.caption}</p>
                                                <p className="text-xs text-bright-blue text-left">{item.category}</p>
                                            </div>
                                        </div>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                
                {/* Pesan jika tidak ada item */}
                {!loading && filteredItems.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate">No items found in this category.</p>
                    </div>
                )}
            </div>

            {/* Unified Lightbox Modal for both Images and Videos - Redesigned */}
            {lightboxOpen && (
                <div
                    className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center z-50"
                    onClick={() => setLightboxOpen(false)}
                >
                    {/* Close Button - Top Right (outside content area) */}
                    <button
                        className="absolute top-6 right-6 text-white text-3xl cursor-pointer z-10  rounded-full p-3 hover:text-gray-400 transition-colors"
                        onClick={() => setLightboxOpen(false)}
                    >
                        ✕
                    </button>
                    
                    {/* Navigation Buttons - Left and Right (outside content area) */}
                    {filteredItems.length > 1 && (
                        <>
                            <button
                                className="absolute left-6 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer z-10  rounded-full p-3 hover:text-gray-400 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex((currentIndex - 1 + filteredItems.length) % filteredItems.length);
                                }}
                            >
                                <ChevronLeft size={32} />
                            </button>
                            <button
                                className="absolute right-6 top-1/2 -translate-y-1/2 text-white text-3xl cursor-pointer z-10 rounded-full p-3 hover:text-gray-400 transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setCurrentIndex((currentIndex + 1) % filteredItems.length);
                                }}
                            >
                                <ChevronRight size={32} />
                            </button>
                        </>
                    )}

                    {/* Main Content Container - Centered and sized to media */}
                    <div
                        className="flex flex-col items-center"
                        onClick={(e) => e.stopPropagation()}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        style={{ cursor: isDragging.current ? 'grabbing' : 'grab' }}
                    >
                        {/* Media Area - Sized based on content */}
                        <div className="bg-black/50 rounded-t-lg overflow-hidden flex justify-center">
                            {'url' in filteredItems[currentIndex] ? (
                                // Image Content - Natural aspect ratio
                                <Image
                                    src={`${baseUrl}${(filteredItems[currentIndex] as GalleryImage).url}`}
                                    alt={filteredItems[currentIndex].caption}
                                    width={1200}
                                    height={1200}
                                    className="max-h-[75vh] w-auto object-contain"
                                    unoptimized={true}
                                />
                            ) : (
                                // Video Content - Sized based on type
                                <div className={
                                    getYouTubeVideoType((filteredItems[currentIndex] as GalleryVideo).youtubeUrl) === 'short'
                                        ? 'w-[40vw] max-w-[400px] aspect-[9/16]'
                                        : 'w-[80vw] max-w-[1200px] aspect-video'
                                }>
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeVideoId((filteredItems[currentIndex] as GalleryVideo).youtubeUrl)}?autoplay=1&mute=0&playsinline=1&loop=1&playlist=${getYouTubeVideoId((filteredItems[currentIndex] as GalleryVideo).youtubeUrl)}`}
                                        title={filteredItems[currentIndex].caption}
                                        className="w-full h-full"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            )}
                        </div>

                        {/* Caption and Category Area - Matches media width exactly */}
                        <div className="bg-dark-navy p-2 rounded-b-lg w-full">
                            <div className="text-center">
                                <p className="text-xl font-bold text-white break-words">{filteredItems[currentIndex].caption}</p>
                                <p className="text-sm text-bright-blue">{filteredItems[currentIndex].category}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}