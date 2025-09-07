// src/app/admin/(panel)/testimonials/page.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import { CheckCircle, ChevronLeft, ChevronRight, Search, Trash2, UserIcon } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import ToggleSwitch from "../(components)/ToggleSwitch";

// Tipe data
interface Testimonial { id: string; name: string; quote: string; isFeatured: boolean; origin: string | null; avatarUrl: string | null; }
interface PaginationInfo { total: number; page: number; limit: number; totalPages: number; }

export default function TestimonialsAdminPage() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [pagination, setPagination] = useState<PaginationInfo | null>(null);
    const [isTableLoading, setIsTableLoading] = useState(true); // Ganti nama state loading
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<Testimonial | null>(null);
    const [notification, setNotification] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');


    useEffect(() => {
        const fetchTestimonials = async () => {
            setIsTableLoading(true); // Tampilkan loading HANYA saat fetch dimulai
            setError(null);
            try {
                const params = new URLSearchParams({
                    page: String(currentPage),
                    limit: '10',
                    ...(debouncedSearchTerm && { search: debouncedSearchTerm }),
                });
                const response = await apiClient(`/testimonials?${params.toString()}`);
                setTestimonials(response.data || []);
                setPagination(response.pagination || null);
            } catch (err: unknown) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setIsTableLoading(false); // Sembunyikan loading setelah fetch selesai
            }
        };
        fetchTestimonials();
    }, [debouncedSearchTerm, currentPage]);

    // --- NOTIFICATION LOGIC ---
    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // --- HANDLERS (LOGIKA AKSI) ---
    const handleToggle = async (id: string, newStatus: boolean) => {
        try {
            console.log(`Attempting to update testimonial ${id} to featured: ${newStatus}`);
            
            // Check if JWT token is available
            let token = null;
            if (typeof window !== 'undefined') {
                token = localStorage.getItem('jwt');
                console.log('JWT token present:', !!token);
            } else {
                console.log('Window is undefined, cannot access localStorage');
            }

            const response = await apiClient(`/testimonials/${id}/featured`, {
                method: 'PATCH',
                body: JSON.stringify({ isFeatured: newStatus }),
            });
            console.log('Update successful:', response);
            setTestimonials(testimonials.map(t => t.id === id ? { ...t, isFeatured: newStatus } : t));
            setNotification(`Testimonial status updated.`);
        } catch (err: unknown) {
            console.error('Error updating testimonial status:', err);
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
            setNotification(`Error: ${errorMessage}`);
        }
    };

    const handleDelete = async () => {
        if (!showDeleteConfirm) return;
        try {
            await apiClient(`/testimonials/${showDeleteConfirm.id}`, { method: 'DELETE' });
            setTestimonials(testimonials.filter(t => t.id !== showDeleteConfirm.id));
            setNotification(`Testimonial from "${showDeleteConfirm.name}" deleted.`);
        } catch (err: unknown) {
            setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md">Error: {error}</div>;

    return (
        <>
            {notification && (
                <div className={`fixed top-5 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down ${notification.startsWith('Error:') ? 'bg-red-500' : 'bg-green-500'
                    }`}>
                    <CheckCircle size={20} className="inline mr-2" />{notification}
                </div>
            )}

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl text-center">
                        <h2 className="text-xl font-bold text-dark-navy mb-4">Delete Testimonial?</h2>
                        <p className="text-slate mb-6">
                            Are you sure you want to delete the testimonial from <br />
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
                <div className="flex justify-between items-center mb-6">
                    <div className="relative w-full max-w-xs">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
                        <input
                            type="text"
                            placeholder="Search by name or quote..."
                            value={searchTerm}
                            // onChange sekarang HANYA mengubah searchTerm
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white p-2 pl-10 rounded-md border border-slate/30"
                        />
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <table className="w-full text-left">
                        <thead className="bg-gray-100 text-left text-gray-600">
                            <tr>
                                <th className="p-4 font-semibold text-dark-navy">Avatar</th>
                                <th className="p-4 font-semibold text-dark-navy">Name</th>
                                <th className="p-4 font-semibold text-dark-navy">Quote</th>
                                <th className="p-4 font-semibold text-dark-navy">Featured</th>
                                <th className="p-4 font-semibold text-dark-navy text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isTableLoading ? (
                                <tr><td colSpan={4} className="text-center p-16 text-slate animate-pulse">Loading...</td></tr>
                            ) : testimonials.length > 0 ? (
                                testimonials.map(item => (
                                    <tr key={item.id} className="border-b border-slate/10 last:border-b-0">
                                        <td className="p-4">
                                            {item.avatarUrl ? (
                                                <div className="relative w-12 h-12 rounded-full overflow-hidden">
                                                    <Image src={`${baseUrl}${item.avatarUrl}`} alt={item.name} layout="fill" objectFit="cover"/>
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 bg-light-gray rounded-full flex items-center justify-center">
                                                    <UserIcon size={24} className="text-slate" />
                                                </div>
                                            )}
                                        </td>
                                        <td className="p-4 text-dark-navy font-medium whitespace-nowrap">{item.name}</td>
                                        <td className="p-4 text-slate italic w-1/2">&quot;{item.quote.substring(0, 70)}...&quot;</td>
                                        <td className="p-4">
                                            <ToggleSwitch initialValue={item.isFeatured} onChange={(newStatus) => handleToggle(item.id, newStatus)} />
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end">
                                                <button onClick={() => setShowDeleteConfirm(item)} className="p-2 text-slate hover:text-red-500 hover:bg-light-gray rounded-md cursor-pointer" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={4} className="text-center p-16 text-slate">No testimonials found.</td></tr>
                            )}
                        </tbody>
                    </table>
                    {!isTableLoading && pagination && pagination.total > 0 && (
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