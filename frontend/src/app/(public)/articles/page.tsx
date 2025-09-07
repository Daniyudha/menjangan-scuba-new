// src/app/(public)/articles/page.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import { stripHtml, truncateText } from '@/lib/utils'; // Impor helper kita
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Tipe data dari backend
interface Article {
  id: string;
  title: string;
  status: 'Published' | 'Draft';
  date: string;
  content: string;
  featuredImage: string | null;
}
interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function ArticlesPage() {
    const [articles, setArticles] = useState<Article[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: String(currentPage),
                    limit: '9', // Tampilkan 9 artikel per halaman (bagus untuk grid 3x3)
                });
                const response = await apiClient(`/articles?${params.toString()}`);
                
                // Di frontend publik, kita hanya ingin menampilkan artikel yang "Published"
                const publishedArticles = (response.data || []).filter((article: Article) => article.status === 'Published');
                
                setArticles(publishedArticles);
                // Kita perlu menghitung ulang pagination berdasarkan artikel yang sudah difilter
                // Di aplikasi nyata, filter 'status=Published' sebaiknya dilakukan di backend
                setPagination(response.pagination);

            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [currentPage]); // Ambil data ulang saat halaman berubah

    return (
        <div className="pt-24 pb-20 bg-dark-navy min-h-screen">
            <div className="container mx-auto px-6">
                {/* Header Halaman */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-white">Diving Articles & News</h1>
                    <p className="mt-4 text-slate max-w-2xl mx-auto">
                        Explore our collection of stories, tips, and insights from the underwater world.
                    </p>
                </div>

                {/* Tampilan Loading atau Error */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Skeleton Loader */}
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="bg-navy rounded-lg shadow-lg h-96 animate-pulse"></div>
                        ))}
                    </div>
                )}
                {error && <p className="text-center text-red-400">Error: {error}</p>}
                
                {/* Grid Artikel */}
                {!loading && !error && articles.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map(article => (
                            <Link key={article.id} href={`/articles/${article.id}`}>
                                <div className="bg-article rounded-lg shadow-lg overflow-hidden h-full flex flex-col group transition-transform duration-300 hover:-translate-y-2">
                                    <div className="relative w-full h-56">
                                        <Image 
                                            src={article.featuredImage ? `${baseUrl}${article.featuredImage}` : 'https://picsum.photos/seed/article/400/300'}
                                            alt={article.title}
                                            layout="fill"
                                            objectFit="cover"
                                            className="group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-6 flex flex-col flex-grow">
                                        <p className="text-sm text-gray-400 font-semibold">{new Date(article.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                        <h3 className="mt-2 text-xl font-bold text-light-slate group-hover:text-white transition-colors">
                                            {article.title}
                                        </h3>
                                        <p className="mt-2 text-gray-300 text-sm flex-grow">
                                            {truncateText(stripHtml(article.content), 100)}
                                        </p>
                                        <div className="mt-4 text-blue-500 font-semibold">Read More &rarr;</div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
                
                {/* Pesan jika tidak ada artikel */}
                {!loading && articles.length === 0 && (
                    <div className="text-center py-16">
                        <p className="text-slate">No articles found.</p>
                    </div>
                )}

                {/* Kontrol Pagination */}
                {!loading && pagination && pagination.totalPages > 1 && (
                    <div className="flex justify-center items-center mt-16 space-x-2">
                        <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={pagination.page === 1} className="p-2 text-slate disabled:opacity-50 hover:text-white hover:bg-navy rounded-full">
                            <ChevronLeft size={24} />
                        </button>
                        <span className="text-slate">
                            Page {pagination.page} of {pagination.totalPages}
                        </span>
                        <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={pagination.page === pagination.totalPages} className="p-2 text-slate disabled:opacity-50 hover:text-white hover:bg-navy rounded-full">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}