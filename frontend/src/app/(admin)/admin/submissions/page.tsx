// src/app/admin/(panel)/submissions/page.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import { CheckCircle, ChevronLeft, ChevronRight, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

// Tipe data
interface Submission { id: string; name: string; email: string; message: string; date: string; isRead: boolean; }
interface PaginationInfo { total: number; page: number; limit: number; totalPages: number; }

export default function SubmissionsAdminPage() {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<Submission | null>(null);

    // --- State Baru untuk Search dan Pagination ---
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);
    const [readFilter, setReadFilter] = useState<'all' | 'read' | 'unread'>('all');

    // --- useEffect yang Diperbarui ---
    useEffect(() => {
        const fetchSubmissions = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: String(currentPage),
                    limit: '5',
                    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                });
                // Tambahkan parameter isRead jika filternya bukan 'all'
                if (readFilter === 'read') params.append('isRead', 'true');
                if (readFilter === 'unread') params.append('isRead', 'false');

                const response = await apiClient(`/submissions?${params.toString()}`);
                setSubmissions(response.data || []);
                setPagination(response.pagination || null);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [debouncedSearchTerm, currentPage, readFilter]);

    // --- NOTIFICATION LOGIC ---
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // --- ACTION HANDLERS ---
    const handleDelete = async () => {
        if (!showDeleteConfirm) return;
        try {
            await apiClient(`/submissions/${showDeleteConfirm.id}`, { method: 'DELETE' });
            setSubmissions(submissions.filter(s => s.id !== showDeleteConfirm.id));
            setNotification(`Submission from "${showDeleteConfirm.name}" has been deleted.`);
        } catch (err: unknown) {
            setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    const handleToggleReadStatus = async (submission: Submission) => {
        const newStatus = !submission.isRead;
        try {
            await apiClient(`/submissions/${submission.id}/read`, {
                method: 'PATCH',
                body: JSON.stringify({ isRead: newStatus })
            });
            setSubmissions(submissions.map(s => s.id === submission.id ? { ...s, isRead: newStatus } : s));
        } catch (err: unknown) {
            setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        }
    };

    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md">Error: {error}</div>;

    return (
        <>
            {notification && (
                <div className={`fixed top-5 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down ${
                    notification.startsWith('Error:') ? 'bg-red-500' : 'bg-green-500'
                }`}>
                    <CheckCircle size={20} className="inline mr-2"/>{notification}
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                        <h2 className="text-xl font-bold text-dark-navy mb-4">Delete Submission?</h2>
                        <p className="text-slate mb-6">
                            Are you sure you want to delete the submission from <br/>
                            <strong className="text-dark-navy">{showDeleteConfirm.name}</strong>?
                        </p>
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowDeleteConfirm(null)} className="px-6 py-2 rounded-md bg-gray-400 text-white hover:bg-gray-300 cursor-pointer">Cancel</button>
                            <button onClick={handleDelete} className="px-6 py-2 rounded-md bg-red-500 text-white hover:bg-red-400 cursor-pointer">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <div>
                {/* --- UI BARU UNTUK SEARCH --- */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                    <div className="relative w-full max-w-xs">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} className="w-full bg-white p-2 pl-10 rounded-md border border-slate/30"/>
                    </div>
                    {/* --- 3. UI BARU UNTUK FILTER --- */}
                    <div className="flex items-center gap-2 p-1 bg-light-gray rounded-lg">
                        <button onClick={() => setReadFilter('all')} className={`px-3 py-1 text-sm rounded-md cursor-pointer ${readFilter === 'all' ? 'bg-white shadow' : ''}`}>All</button>
                        <button onClick={() => setReadFilter('unread')} className={`px-3 py-1 text-sm rounded-md cursor-pointer ${readFilter === 'unread' ? 'bg-white shadow' : ''}`}>Unread</button>
                        <button onClick={() => setReadFilter('read')} className={`px-3 py-1 text-sm rounded-md cursor-pointer ${readFilter === 'read' ? 'bg-white shadow' : ''}`}>Read</button>
                    </div>
                </div>
                
                {loading ? (
                    <div className="text-center py-16">Loading submissions...</div>
                ) : (
                    <div className="space-y-4">
                        {submissions.length > 0 ? (
                            submissions.map(sub => (
                                <div key={sub.id} className={`p-6 rounded-lg shadow-md border-l-4 transition-colors ${
                                    sub.isRead ? 'bg-white border-slate-200' : 'bg-blue-50 border-bright-blue'
                                }`}>
                                    <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-lg text-dark-navy">{sub.name}</p>
                                    <a href={`mailto:${sub.email}`} className="text-sm text-bright-blue hover:underline">{sub.email}</a>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate">{new Date(sub.date).toLocaleDateString()}</span>
                                    <button 
                                        onClick={() => setShowDeleteConfirm(sub)}
                                        className="p-2 text-slate hover:text-red-500 hover:bg-light-gray rounded-md"
                                        title="Delete Submission"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p className="mt-4 text-slate italic bg-light-gray p-4 rounded-md">&quot;{sub.message}&quot;</p>
                             <div className="mt-4 text-right">
                                <button 
                                    onClick={() => handleToggleReadStatus(sub)}
                                    className={`text-xs font-semibold px-3 py-1 rounded-full transition-colors ${
                                        sub.isRead ? 'bg-slate-200 text-slate hover:bg-slate-300' : 'bg-blue-100 text-bright-blue hover:bg-blue-200'
                                    }`}
                                >
                                    {sub.isRead ? 'Mark as Unread' : 'Mark as Read'}
                                </button>
                            </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-lg border border-slate/20">
                                <p className="text-slate">No submissions found.</p>
                            </div>
                        )}
                    </div>
                )}
                
                {/* --- UI BARU UNTUK PAGINATION --- */}
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
        </>
    );
}