// src/app/(public)/articles/[id]/page.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import { stripHtml, truncateText } from '@/lib/utils';
import { Calendar } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { use, useEffect, useState } from 'react'; // 1. Impor 'use' dari React

// Tipe data
interface Article { id: string; title: string; date: string; content: string; featuredImage: string | null; }
interface ArticleDetailData { mainArticle: Article; relatedArticles: Article[]; }

export default function ArticleDetailPage({ params }: { params: Promise<{ id: string }> }) { // 2. 'params' sekarang adalah Promise
    const [articleData, setArticleData] = useState<Partial<ArticleDetailData>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // 3. Gunakan React.use() untuk mendapatkan nilai 'id'
    const { id } = use(params);
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

    useEffect(() => {
        if (id) {
            const fetchArticle = async () => {
                try {
                    // Gunakan endpoint publik yang benar
                    const data = await apiClient(`/articles/public/${id}`);
                    setArticleData(data);
                } catch (err: unknown) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred');
                } finally {
                    setLoading(false);
                }
            };
            fetchArticle();
        }
    }, [id]); // Dependensi 'id' sekarang aman digunakan

    if (loading) {
        return (
            <div className="pt-24 pb-20 bg-dark-navy min-h-screen">
                <div className="container mx-auto px-6 max-w-4xl animate-pulse">
                    <div className="h-10 bg-navy rounded w-3/4 mb-4"></div>
                    <div className="h-6 bg-navy rounded w-1/2 mb-8"></div>
                    <div className="aspect-video bg-navy rounded-lg mb-8"></div>
                    <div className="space-y-4">
                        <div className="h-6 bg-navy rounded w-full"></div>
                        <div className="h-6 bg-navy rounded w-full"></div>
                        <div className="h-6 bg-navy rounded w-5/6"></div>
                    </div>
                </div>
            </div>
        );
    }
    
    if (error) return <div className="pt-32 text-center text-red-400 min-h-screen">Error: {error}</div>;

    const { mainArticle, relatedArticles } = articleData;

    return (
        <div className="pt-24 pb-20 bg-dark-navy min-h-screen">
            <div className="container mx-auto px-6 max-w-6xl">
                {mainArticle && (
                    <article>
                        <div className="mb-8">
                            <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                                {mainArticle.title}
                            </h1>
                            <div className="flex items-center text-slate text-sm">
                                <Calendar size={16} className="mr-2"/>
                                <span>Published on {new Date(mainArticle.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                            </div>
                        </div>
                        {mainArticle.featuredImage && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-8">
                                <Image src={`${baseUrl}${mainArticle.featuredImage}`} alt={mainArticle.title} layout="fill" objectFit="cover"/>
                            </div>
                        )}
                        <div 
                            className="prose prose-invert prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: mainArticle.content }} 
                        />
                    </article>
                )}

                {relatedArticles && relatedArticles.length > 0 && (
                    <div className="mt-20 pt-12 border-t border-light-navy/20">
                        <h2 className="text-3xl font-bold text-white mb-8">Read More Articles</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedArticles.map(article => (
                                <Link key={article.id} href={`/articles/${article.id}`}>
                                    <div className="bg-navy rounded-lg overflow-hidden h-full flex flex-col group">
                                        <div className="relative w-full h-48">
                                            <Image 
                                                src={article.featuredImage ? `${baseUrl}${article.featuredImage}` : 'https://picsum.photos/seed/related/400/300'}
                                                alt={article.title}
                                                layout="fill"
                                                objectFit="cover"
                                            />
                                        </div>
                                        <div className="p-4 flex flex-col flex-grow">
                                            <h3 className="text-lg font-bold text-light-slate group-hover:text-white transition-colors">
                                                {article.title}
                                            </h3>
                                            <p className="mt-2 text-slate text-sm flex-grow">
                                                {truncateText(stripHtml(article.content), 80)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}