// src/app/admin/(panel)/articles/edit/[id]/page.tsx
"use client";

import { apiClient, apiClientFormData } from '@/lib/apiClient';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, use, useEffect, useState } from 'react';

// 1. Perbaiki path import agar sesuai dengan struktur folder Anda
const Editor = dynamic(() => import('@/app/(admin)/admin/(components)/CustomEditor'), { 
    ssr: false,
    loading: () => <p>Loading editor...</p> 
});

// 2. Perbaiki tipe data
interface Article {
  id: string;
  title: string;
  status: 'Published' | 'Draft';
  date: string;
  content: string;
  featuredImage: string | null; // Dari API, ini adalah string (URL) atau null
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [formData, setFormData] = useState<Partial<Article>>({});
  const [editorContent, setEditorContent] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const baseUrl = apiUrl.replace('/api', '');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // 3. Perbaiki URL endpoint API
        const data: Article = await apiClient(`/articles/admin/${id}`);
        setFormData(data);
        setEditorContent(data.content || '');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      setError("Article Title is required.");
      return;
    }
    setShowSaveConfirm(true);
  };
  
  const confirmSave = async () => {
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title || '');
    dataToSend.append('status', formData.status || 'Draft');
    dataToSend.append('content', editorContent);
    if (imageFile) {
      dataToSend.append('featuredImage', imageFile);
    }

    try {
      // Use the enhanced API client for FormData requests
      await apiClientFormData(`/articles/${id}`, dataToSend, 'PUT');
      
      localStorage.setItem('articleNotification', `Article "${formData.title}" was successfully updated.`);
      router.push('/admin/articles');

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setShowSaveConfirm(false);
    }
  };
  
  if (loading) return <div>Loading article data...</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-md">Error: {error}</div>;

  return (
    <>
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
           <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-bold text-dark-navy mb-4">Confirm Changes</h2>
            <p className="text-slate mb-6">Are you sure you want to save these changes?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowSaveConfirm(false)} className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black transition duration-300 cursor-pointer">Cancel</button>
              <button onClick={confirmSave} className="px-6 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white transition duration-300 cursor-pointer">Yes, Save</button>
            </div>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-dark-navy mb-8">Edit Article: <span className="text-bright-blue">{formData.title}</span></h1>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</p>}

        <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div>
                <label className="block text-sm font-medium text-slate mb-1">Article Title</label>
                <input type="text" name="title" value={formData.title || ''} onChange={handleChange} className="w-full bg-light-gray p-3 rounded-md border border-slate/30"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate mb-1">Content</label>
                <div className="mt-2 prose max-w-none">
                    {!loading && <Editor initialData={editorContent} onChange={(data: string) => setEditorContent(data)} />}
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate mb-1">Featured Image</label>
                    <input type="file" name="featuredImage" onChange={handleFileChange} className="w-full text-slate border border-slate/30 rounded-md file:mr-4 file:py-3 file:px-4 file:border-0 file:bg-gray-200 file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-gray-300"/>
                    {/* Image preview - responsive container to prevent overflow */}
                    <div className="mt-6 relative aspect-video">
                        {imagePreview ? (
                            <Image src={imagePreview} alt="New preview" fill className="object-cover rounded-md" />
                        ) : formData.featuredImage ? (
                            <Image src={`${baseUrl}${formData.featuredImage}`} alt="Current image" fill className="object-cover rounded-md" />
                        ) : (
                            <div className="w-full h-full bg-light-gray flex items-center justify-center text-xs text-slate rounded-md">No Image</div>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate mb-1">Status</label>
                    <select name="status" value={formData.status || 'Draft'} onChange={handleChange} className="w-full bg-light-gray p-3 rounded-md border border-slate/30">
                        <option value="Draft">Draft</option>
                        <option value="Published">Published</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t border-slate/20">
                <Link href="/admin/articles" className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black transition duration-300">Cancel</Link>
            <button type="submit" className="bg-light-navy text-white px-4 py-2 rounded-md cursor-pointer transition duration-300">Edit Article</button>
            </div>
        </form>
      </div>
    </>
  );
}