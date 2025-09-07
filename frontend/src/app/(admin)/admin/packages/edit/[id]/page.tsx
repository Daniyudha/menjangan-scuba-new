// src/app/admin/(panel)/packages/edit/[id]/page.tsx
"use client";

import { apiClient, apiClientFormData } from '@/lib/apiClient';
import { formatPrice, unformatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, use, useEffect, useState } from 'react';

// Tipe data untuk paket
interface Package {
  id: string;
  title: string;
  price: string;
  description: string;
  inclusions: string[];
  imageUrl: string | null;
}

export default function EditPackagePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);

  const [pkg, setPkg] = useState<Partial<Package>>({});
  const [inclusionsText, setInclusionsText] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const baseUrl = apiUrl.replace('/api', '');

  useEffect(() => {
    if (id) {
      const fetchPackage = async () => {
        try {
          const data: Package = await apiClient(`/packages/${id}`);
          // Format harga sebelum disimpan ke state
          data.price = `IDR ${formatPrice(data.price)}`;
          setPkg(data);
          setInclusionsText(data.inclusions.join('\n'));
        } catch (err: unknown) {
          setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
          setLoading(false);
        }
      };
      fetchPackage();
    }
  }, [id]);

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedPrice = formatPrice(e.target.value);
    setPkg(prev => ({ ...prev, price: `IDR ${formattedPrice}` }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'inclusions') {
      setInclusionsText(value);
    } else {
      setPkg(prev => ({ ...prev, [name]: value }));
    }
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
    setShowSaveConfirm(true);
  };

  const confirmSave = async () => {
    const formData = new FormData();

    formData.append('title', pkg?.title || '');
    formData.append('price', `IDR ${unformatPrice(pkg?.price || '')}`);
    formData.append('description', pkg?.description || '');
    formData.append('inclusions', inclusionsText);

    if (imageFile) {
      formData.append('featuredImage', imageFile);
    }

    try {
      // Use apiClientFormData for consistent JWT Bearer token authentication
      await apiClientFormData(`/packages/${id}`, formData, 'PUT');

      localStorage.setItem('packageNotification', `Package "${pkg?.title}" was successfully updated.`);
      router.push('/admin/packages');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setShowSaveConfirm(false);
    }
  };

  if (loading) return <div>Loading package data...</div>;
  if (error) return <div className="text-red-500 p-4 bg-red-100 rounded-md">Error: {error}</div>;

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
        <h1 className="text-3xl font-bold text-dark-navy mb-8">Edit Package: <span className="text-bright-blue">{pkg?.title}</span></h1>
        <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate mb-1">Package Title</label>
              <input type="text" name="title" value={pkg?.title || ''} onChange={handleChange} className="w-full bg-light-gray p-3 rounded-md border border-slate/30" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate mb-1">Price</label>
              <input
                type="text"
                name="price"
                value={pkg?.price || ''}
                onChange={handlePriceChange} // Gunakan handler khusus
                placeholder="e.g., IDR 1.500.000"
                className="w-full bg-light-gray p-3 rounded-md border border-slate/30"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1">Description</label>
            <textarea rows={4} name="description" value={pkg?.description || ''} onChange={handleChange} className="w-full bg-light-gray p-3 rounded-md border border-slate/30" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1">Inclusions (one per line)</label>
            <textarea rows={5} name="inclusions" value={inclusionsText} onChange={handleChange} className="w-full bg-light-gray p-3 rounded-md border border-slate/30 font-mono" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate mb-1">Featured Image</label>
            <input type="file" onChange={handleFileChange} className="w-full text-slate border border-slate/30 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-200 file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-gray-300" />
            <div className="mt-6 relative w-100 h-100">
              {imagePreview ? (
                <Image src={imagePreview} alt="New preview" fill className="object-cover rounded-md" />
              ) : pkg?.imageUrl ? (
                <Image src={`${baseUrl}${pkg.imageUrl}`} alt="Current image" fill className="object-cover rounded-md" />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-slate rounded-md">No Image</div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-4 pt-4 border-t border-slate/20">
                <Link href="/admin/packages" className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black transition duration-300">Cancel</Link>
                <button type="submit" className="bg-light-navy text-white px-4 py-2 rounded-md cursor-pointer transition duration-300">Create Package</button>
            </div>
        </form>
      </div>
    </>
  );
}