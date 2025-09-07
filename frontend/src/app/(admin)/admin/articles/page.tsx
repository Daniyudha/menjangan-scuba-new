// src/app/admin/(panel)/articles/page.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import { stripHtml, truncateText } from '@/lib/utils';
import { CheckCircle, ChevronLeft, ChevronRight, Edit2, Image as ImageIcon, Plus, Search, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

// Tipe data
interface Article {
  id: string;
  title: string;
  status: 'Published' | 'Draft';
  date: string;
  content: string;
  featuredImage: string | null;
}
interface PaginationInfo { total: number; page: number; limit: number; totalPages: number; }

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Article | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          limit: '10',
          ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
        });
        const response = await apiClient(`/articles?${params.toString()}`);

        // --- PERBAIKAN UTAMA: Pastikan data adalah array ---
        setArticles(Array.isArray(response.data) ? response.data : []);
        setPagination(response.pagination || null);

      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setArticles([]); // Set ke array kosong jika ada error
        setPagination(null);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, [debouncedSearchTerm, currentPage]);

  useEffect(() => {
    const savedNotification = localStorage.getItem('articleNotification');
    if (savedNotification) {
      setNotification(savedNotification);
      localStorage.removeItem('articleNotification');
    }
  }, []);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleDelete = async () => {
    if (showDeleteConfirm) {
      try {
        await apiClient(`/articles/${showDeleteConfirm.id}`, { method: 'DELETE' });
        setArticles(articles.filter(a => a.id !== showDeleteConfirm.id));
        setNotification(`Article "${showDeleteConfirm.title}" has been deleted.`);
      } catch (err: unknown) {
        setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
      } finally {
        setShowDeleteConfirm(null);
      }
    }
  };

  // Render logic tidak berubah, tetapi sekarang lebih aman
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md">Error: {error}</div>;

  return (
    <>
      {notification && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down ${notification.startsWith('Error:') ? 'bg-red-500' : 'bg-green-500'}`}>
          <CheckCircle size={20} className="inline mr-2" />{notification}
        </div>
      )}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-bold text-dark-navy mb-4">Are you sure?</h2>
            <p className="text-slate mb-6">You are about to delete the article: <br /><strong className="text-dark-navy">{showDeleteConfirm.title}</strong></p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black transition duration-300 cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-6 py-2 rounded-md bg-red-500 hover:bg-red-700 text-white transition duration-300 cursor-pointer">Yes, Delete</button></div>
          </div>
        </div>
      )}

      <div>
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-xs">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input type="text" placeholder="Search articles..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full bg-white p-2 pl-10 rounded-md border border-slate/30" />
          </div>
          <Link href="/admin/articles/new" className="bg-light-navy text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={18} /><span>Write New Article</span>
          </Link>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                <th className="p-4 font-semibold text-dark-navy">Image</th>
                <th className="p-4 font-semibold text-dark-navy">Title</th>
                <th className="p-4 font-semibold text-dark-navy">Content Preview</th>
                <th className="p-4 font-semibold text-dark-navy">Status</th>
                <th className="p-4 font-semibold text-dark-navy">Date</th>
                <th className="p-4 font-semibold text-dark-navy text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center p-16 text-slate animate-pulse">Loading...</td></tr>
              ) : articles.length > 0 ? (
                articles.map(article => (
                  <tr key={article.id} className="border-b border-slate/10 last:border-b-0">
                    <td className="p-4">{article.featuredImage ? (<div className="relative w-20 h-12 rounded-md overflow-hidden"><Image src={`${baseUrl}${article.featuredImage}`} alt={article.title} layout="fill" objectFit="cover" /></div>) : (<div className="w-20 h-12 bg-light-gray rounded-md flex items-center justify-center"><ImageIcon size={20} className="text-slate" /></div>)}</td>
                    <td className="p-4 text-dark-navy font-medium whitespace-nowrap">{article.title}</td>
                    <td className="p-4 text-slate text-sm max-w-sm">{truncateText(stripHtml(article.content), 80)}</td>
                    <td className="p-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${article.status === 'Published' ? 'bg-green-500/20 text-green-700' : 'bg-yellow-500/20 text-yellow-700'}`}>{article.status}</span></td>
                    <td className="p-4 text-slate whitespace-nowrap">{article.date}</td>
                    <td className="p-4"><div className="flex justify-end gap-2"><Link href={`/admin/articles/edit/${article.id}`} className="p-2 text-slate hover:text-blue-500 rounded-md" title="Edit"><Edit2 size={16} /></Link><button onClick={() => setShowDeleteConfirm(article)} className="p-2 text-slate hover:text-red-500 cursor-pointer rounded-md" title="Delete"><Trash2 size={16} /></button></div></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="text-center p-16 text-slate">No articles found. Try adjusting your search.</td></tr>
              )}
            </tbody>
          </table>

          {!loading && pagination && pagination.total > 0 && (
            <div className="flex justify-between items-center mt-6">
              <p className="text-sm text-slate">Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} results</p>
              <div className="flex items-center gap-2">
                <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={pagination.page === 1} className="p-2 disabled:opacity-50"><ChevronLeft size={20} /></button>
                <span className="text-sm font-medium">Page {pagination.page} of {pagination.totalPages}</span>
                <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={pagination.page === pagination.totalPages} className="p-2 disabled:opacity-50"><ChevronRight size={20} /></button>
              </div>
            </div>
          )}
        </div>
      </div>


    </>
  );
}