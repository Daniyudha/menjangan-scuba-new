// src/app/admin/(panel)/dashboard/page.tsx
"use client";

import { Edit2, FileText, ImageIcon, Package, Star } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Tipe data yang lebih lengkap dari API
interface HeroSlide { id: string; headline: string; }
interface ExperienceData { videoUrl: string; imageUrl: string; }
interface RecentSubmission { id: string; name: string; email: string; message: string; }
interface RecentArticle { id: string; title: string; date: string; }

interface DashboardStats {
    packageCount: number;
    articleCount: number;
    galleryImageCount: number;
    testimonialCount: number;
    heroHeadlines: HeroSlide[];
    experienceMedia: ExperienceData;
    recentArticles: RecentArticle[];
    recentSubmissions: RecentSubmission[];
}

export default function DashboardPage() {
    const [stats, setStats] = useState<Partial<DashboardStats>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const baseUrl = apiUrl.replace('/api', '');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch(`${apiUrl}/dashboard`, {
                    method: 'GET',
                    credentials: 'include', // ⬅️ ini penting agar cookie JWT ikut
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        // Kalau belum login, arahkan ke halaman login
                        window.location.href = '/admin/login';
                    }
                    throw new Error('Failed to fetch dashboard data.');
                }

                const data = await response.json();
                setStats(data);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, [apiUrl]);


    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white h-28 rounded-lg shadow-md animate-pulse"></div>
                    <div className="bg-white h-28 rounded-lg shadow-md animate-pulse"></div>
                    <div className="bg-white h-28 rounded-lg shadow-md animate-pulse"></div>
                    <div className="bg-white h-28 rounded-lg shadow-md animate-pulse"></div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white h-64 rounded-lg shadow-md animate-pulse"></div>
                    <div className="bg-white h-64 rounded-lg shadow-md animate-pulse"></div>
                </div>
            </div>
        );
    }

    if (error) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div className="space-y-8">
            {/* KARTU STATISTIK CEPAT */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <div className="bg-blue-100 p-3 rounded-full"><Package className="text-blue-500" /></div>
                    <div><p className="text-sm text-slate">Total Packages</p><p className="text-2xl font-bold text-dark-navy">{stats.packageCount || 0}</p></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-full"><FileText className="text-green-500" /></div>
                    <div><p className="text-sm text-slate">Total Articles</p><p className="text-2xl font-bold text-dark-navy">{stats.articleCount || 0}</p></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <div className="bg-purple-100 p-3 rounded-full"><ImageIcon className="text-purple-500" /></div>
                    <div><p className="text-sm text-slate">Gallery Images</p><p className="text-2xl font-bold text-dark-navy">{stats.galleryImageCount || 0}</p></div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-4">
                    <div className="bg-yellow-100 p-3 rounded-full"><Star className="text-yellow-500" /></div>
                    <div><p className="text-sm text-slate">Testimonials</p><p className="text-2xl font-bold text-dark-navy">{stats.testimonialCount || 0}</p></div>
                </div>
            </div>

            {/* RINGKASAN PENGATURAN KONTEN */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-dark-navy">Hero Section Headlines</h2>
                        <Link href="/admin/settings" className="text-sm font-semibold text-slate hover:text-blue-400 flex items-center gap-1">
                            <Edit2 size={14} /> Edit
                        </Link>
                    </div>
                    <div className="flex-grow">
                        <ul className="list-disc list-inside space-y-2 text-slate">
                            {stats.heroHeadlines?.map(item => <li key={item.id}>{item.headline}</li>)}
                        </ul>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-dark-navy">Experience Section Media</h2>
                        <Link href="/admin/settings" className="text-sm font-semibold text-slate hover:text-blue-400 flex items-center gap-1">
                            <Edit2 size={14} /> Edit
                        </Link>
                    </div>
                    <div className="flex-grow space-y-4">
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-dark-navy w-24">Video URL:</p>
                            <a href={stats.experienceMedia?.videoUrl} className="text-bright-blue hover:underline text-sm truncate" target="_blank" rel="noreferrer">
                                {stats.experienceMedia?.videoUrl || 'Not set'}
                            </a>
                        </div>
                        <div className="flex items-start gap-2">
                            <p className="font-medium text-dark-navy w-24">Image:</p>
                            {stats.experienceMedia?.imageUrl ? (
                                <div className="relative w-60 h-30 rounded-md overflow-hidden border">
                                    <Image
                                        src={`${baseUrl}${stats.experienceMedia.imageUrl}`}
                                        alt="Experience Preview"
                                        layout="fill"
                                        objectFit="cover"
                                    />
                                </div>
                            ) : (<span className="text-sm text-slate">Not set</span>)}
                        </div>
                    </div>
                </div>
            </div>

            {/* AKTIVITAS TERBARU */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-dark-navy mb-4">Recent Articles</h2>
                    <div className="space-y-4">
                        {stats.recentArticles && stats.recentArticles.length > 0 ? (
                            stats.recentArticles.map(article => (
                                <div key={article.id} className="flex justify-between items-center text-sm">
                                    <Link href={`/admin/articles/edit/${article.id}`} className="text-light-navy hover:text-bright-blue font-medium truncate pr-4">{article.title}</Link>
                                    <span className="text-slate flex-shrink-0">{article.date}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate text-sm">No recent articles.</p>
                        )}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-dark-navy mb-4">Recent Submissions</h2>
                    <div className="space-y-4">
                        {stats.recentSubmissions && stats.recentSubmissions.length > 0 ? (
                            stats.recentSubmissions.map(sub => (
                                <div key={sub.id} className="text-sm border-b border-slate/10 pb-2 last:border-b-0">
                                    <div className="flex justify-between">
                                        <p className="font-medium text-dark-navy">{sub.name}</p>
                                        <Link href={`mailto:${sub.email}`} className="text-xs text-bright-blue hover:underline">{sub.email}</Link>
                                    </div>
                                    <p className="text-slate truncate mt-1">&quot;{sub.message}&quot;</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-slate text-sm">No recent submissions.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}