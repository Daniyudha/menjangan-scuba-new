// src/app/admin/(panel)/gallery/page.tsx
"use client";

import { apiClient, apiClientFormData } from '@/lib/apiClient';
import { CheckCircle, Plus, Tag, Trash2, X } from 'lucide-react';
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

// Tipe data dari backend
interface GalleryImage { id: string; url: string; caption: string; category: string; createdAt: string; }
interface GalleryVideo { id: string; youtubeUrl: string; caption: string; category: string; createdAt: string; }
interface GalleryCategory { id: string; name: string; }

type GalleryItem = GalleryImage | GalleryVideo;

export default function GalleryAdminPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [videos, setVideos] = useState<GalleryVideo[]>([]);
    const [categories, setCategories] = useState<GalleryCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string>('All');
    const [notification, setNotification] = useState<string | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<GalleryItem | null>(null);
    const [activeTab, setActiveTab] = useState<'images' | 'videos'>('images');

    const [uploadPreview, setUploadPreview] = useState<string | null>(null);
    const [youtubeUrl, setYoutubeUrl] = useState('');

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    const baseUrl = apiUrl.replace('/api', '');

    useEffect(() => {
        const fetchData = async () => {
            try {
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

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUploadPreview(URL.createObjectURL(file));
        }
    };

    const handleAddCategory = async (e: FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;
        try {
            const newCategory = await apiClient('/gallery/categories', {
                method: 'POST',
                body: JSON.stringify({ name: newCategoryName }),
            });
            setCategories([...categories, newCategory]);
            setNewCategoryName('');
            setNotification(`Category "${newCategory.name}" added.`);
        } catch (err: unknown) {
            setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        }
    };

    // --- PERBAIKAN UTAMA DI SINI ---
    const handleDeleteCategory = async (id: string, name: string) => {
        // Baris 'if (!confirm(...)) return;' telah dihapus.
        try {
            await apiClient(`/gallery/categories/${id}`, { method: 'DELETE' });
            setCategories(categories.filter(c => c.id !== id));
            setNotification(`Category "${name}" deleted.`);
        } catch (err: unknown) {
            setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        }
    };
    
    const handleUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            // Use apiClientFormData for consistent JWT Bearer token authentication
            const newImage = await apiClientFormData('/gallery/images', formData, 'POST');
            setImages([newImage, ...images]);
            (e.target as HTMLFormElement).reset();
            setNotification('Image uploaded successfully.');
        } catch (err: unknown) {
            setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        }
    };

    const handleVideoUpload = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            const newVideo = await apiClient('/gallery/videos', {
                method: 'POST',
                body: JSON.stringify({
                    youtubeUrl: youtubeUrl,
                    caption: formData.get('caption') as string,
                    category: formData.get('category') as string
                }),
            });
            setVideos([newVideo, ...videos]);
            (e.target as HTMLFormElement).reset();
            setYoutubeUrl('');
            setNotification('Video added successfully.');
        } catch (err: unknown) {
            setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        }
    };

    const handleDeleteItem = async () => {
        if (!showDeleteConfirm) return;
        try {
            if ('url' in showDeleteConfirm) {
                await apiClient(`/gallery/images/${showDeleteConfirm.id}`, { method: 'DELETE' });
                setImages(images.filter(img => img.id !== showDeleteConfirm.id));
                setNotification(`Image "${showDeleteConfirm.caption}" deleted.`);
            } else {
                await apiClient(`/gallery/videos/${showDeleteConfirm.id}`, { method: 'DELETE' });
                setVideos(videos.filter(video => video.id !== showDeleteConfirm.id));
                setNotification(`Video "${showDeleteConfirm.caption}" deleted.`);
            }
        } catch (err: unknown) {
            setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        } finally {
            setShowDeleteConfirm(null);
        }
    };
    
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
    const filteredItems = activeCategory === 'All' ? allItems : allItems.filter(item => item.category === activeCategory);
    
    if (loading) return <div>Loading gallery...</div>;
    if (error && images.length === 0 && videos.length === 0) return <div className="text-red-500">Error: {error}</div>;

    return (
        <div>
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
                        <h2 className="text-xl font-bold text-dark-navy mb-4">Delete Item?</h2>
                        <p className="text-slate mb-6">
                            Are you sure you want to delete this item: <br />
                            <strong className="text-dark-navy">{showDeleteConfirm.caption}</strong>
                        </p>
                        {'url' in showDeleteConfirm ? (
                            <Image src={`${baseUrl}${showDeleteConfirm.url}`} alt={showDeleteConfirm.caption} width={100} height={100} className="mx-auto my-4 rounded-md object-cover"/>
                        ) : (
                            <div className="w-40 aspect-video mx-auto my-4">
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(showDeleteConfirm.youtubeUrl)}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${getYouTubeVideoId(showDeleteConfirm.youtubeUrl)}`}
                                    title={showDeleteConfirm.caption}
                                    className="w-full h-full rounded-md"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setShowDeleteConfirm(null)} className="px-6 py-2 rounded-md bg-gray-400 hover:bg-gray-300 cursor-pointer text-white">Cancel</button>
                            <button onClick={handleDeleteItem} className="px-6 py-2 rounded-md bg-red-500 hover:bg-red-400 cursor-pointer text-white">Yes, Delete</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-dark-navy mb-4">Manage Categories</h2>
                    <form onSubmit={handleAddCategory} className="flex gap-2">
                        <input value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} type="text" placeholder="Add new category..." className="flex-grow bg-light-gray p-2 rounded-md border border-slate/30"/>
                        <button type="submit" className="bg-light-navy rounded-md text-white px-3 py-2 cursor-pointer"><Plus size={20} /></button>
                    </form>
                    <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] mt-4">
                        {categories.map(cat => (
                            <div key={cat.id} className="flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm">
                                <span className="text-slate">{cat.name}</span>
                                {/* Tombol ini sekarang langsung memanggil handleDeleteCategory */}
                                <button onClick={() => handleDeleteCategory(cat.id, cat.name)} className="ml-2 text-red-400 hover:text-red-600 cursor-pointer"><X size={14} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-dark-navy mb-4">Upload New Image</h2>
                    <form className="space-y-4" onSubmit={handleUpload}>
                        <div>
                            <label className="block text-sm font-medium text-slate mb-1">Image File</label>
                            <input
                                type="file"
                                name="upload"
                                required
                                onChange={handleFileChange} // Hubungkan ke handler baru
                                className="w-full text-slate border border-slate/30 rounded-md cursor-pointer file:cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-200 file:text-sm file:font-semibold file:bg-light-gray file:text-gray-blue hover:file:bg-slate/20"
                            />
                        </div>
                        {/* Tampilkan pratinjau gambar jika ada */}
                        {uploadPreview && (
                            <div>
                                <p className="text-xs text-slate mb-1">Image Preview:</p>
                                <div className="relative w-50 aspect-square rounded-md overflow-hidden shadow">
                                    <Image src={uploadPreview} alt="Image preview" layout="fill" objectFit="cover" />
                                </div>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate mb-1">Caption</label>
                            <input type="text" name="caption" required placeholder="e.g., Turtle at Coral Garden" className="w-full bg-light-gray p-3 rounded-md border border-slate/30"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate mb-1">Category</label>
                            <select name="category" required className="w-full bg-light-gray p-3 rounded-md border border-slate/30" disabled={categories.length === 0}>
                                {categories.length > 0 ? (
                                    categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)
                                ) : (
                                    <option>Please add a category first</option>
                                )}
                            </select>
                        </div>
                        <div className="text-right">
                           <button type="submit" className="bg-light-navy text-white py-2 px-4 rounded-lg cursor-pointer transision duration-300">Upload</button>
                        </div>
                    </form>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-bold text-dark-navy mb-4">Add YouTube Video</h2>
                    <form className="space-y-4" onSubmit={handleVideoUpload}>
                        <div>
                            <label className="block text-sm font-medium text-slate mb-1">YouTube URL</label>
                            <input
                                type="url"
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                                required
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full bg-light-gray p-3 rounded-md border border-slate/30"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate mb-1">Caption</label>
                            <input type="text" name="caption" required placeholder="e.g., Diving with Turtles" className="w-full bg-light-gray p-3 rounded-md border border-slate/30"/>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate mb-1">Category</label>
                            <select name="category" required className="w-full bg-light-gray p-3 rounded-md border border-slate/30" disabled={categories.length === 0}>
                                {categories.length > 0 ? (
                                    categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)
                                ) : (
                                    <option>Please add a category first</option>
                                )}
                            </select>
                        </div>
                        <div className="text-right">
                           <button type="submit" className="bg-light-navy text-white py-2 px-4 rounded-lg cursor-pointer transision duration-300">Add Video</button>
                        </div>
                    </form>
                </div>
            </div>

            <div>
                <h2 className="text-2xl font-bold text-dark-navy mb-4">Gallery Preview</h2>
                <div className="flex flex-wrap gap-2 mb-6 border-b border-slate/20 pb-4">
                    <button onClick={() => setActiveCategory('All')} className={`px-4 py-2 text-sm font-semibold rounded-full ${activeCategory === 'All' ? 'bg-blue-400 text-white' : 'cursor-pointer bg-white text-slate hover:bg-blue-400 hover:text-white'}`}>All</button>
                    {categories.map(cat => (
                         <button key={cat.id} onClick={() => setActiveCategory(cat.name)} className={`px-4 py-2 text-sm font-semibold rounded-full ${activeCategory === cat.name ? 'bg-blue-400 text-white' : 'cursor-pointer bg-white text-slate hover:bg-blue-400 hover:text-white'}`}>
                            {cat.name}
                        </button>
                    ))}
                </div>

                <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6">
                    {filteredItems.map(item => (
                    <div key={item.id} className="break-inside-avoid mb-6 relative group bg-navy rounded-lg overflow-hidden shadow-md">
                        {'url' in item ? (
                            // Render Image
                            <Image src={`${baseUrl}${item.url}`} alt={item.caption} width={400} height={400} className="w-full h-auto object-cover"/>
                        ) : (
                            // Render Video with automatic aspect ratio
                            <div className={`aspect-${getYouTubeVideoType(item.youtubeUrl) === 'short' ? '9/16' : '16/9'} w-full`}>
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeVideoId(item.youtubeUrl)}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${getYouTubeVideoId(item.youtubeUrl)}`}
                                    title={item.caption}
                                    className="w-full h-full"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                            <p className="text-white font-medium text-sm truncate">{item.caption}</p>
                            <p className="text-xs text-bright-blue font-semibold flex items-center gap-1 mt-1"><Tag size={12} /> {item.category}</p>
                        </div>
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setShowDeleteConfirm(item)} className="flex items-center gap-2 text-red-400 font-semibold hover:text-red-500 cursor-pointer">
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                    ))}
                </div>
                {filteredItems.length === 0 && (
                    <div className="text-center py-16 bg-white rounded-lg shadow-lg">
                        <p className="text-slate">No items found in the &quot;{activeCategory}&quot; category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}