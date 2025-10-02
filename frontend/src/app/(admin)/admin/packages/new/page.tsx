// src/app/admin/(panel)/packages/new/page.tsx
"use client";

import { apiClientFormData } from '@/lib/apiClient';
import { formatPrice, unformatPrice } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useState } from 'react';

interface NewPackageData {
  title: string;
  price: string;
  description: string;
}

export default function NewPackagePage() {
  const router = useRouter();
  
  // State untuk mengelola input teks
  const [formData, setFormData] = useState<NewPackageData>({
    title: '',
    price: '',
    description: '',
  });
  const [inclusionsText, setInclusionsText] = useState('');
  
  // State untuk mengelola file dan pratinjaunya
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'inclusions') {
      setInclusionsText(value);
    } else {
      setFormData(prevState => ({ ...prevState, [name]: value }));
    }
  };

  const handlePriceChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Format angka saat pengguna mengetik
    const formattedPrice = formatPrice(e.target.value);
    // Tambahkan "IDR " di depannya sebelum disimpan ke state
    setFormData(prevState => ({ ...prevState, price: `${formattedPrice}` }));
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
    setError(null);
    if (!formData.title || !formData.price) {
      setError("Title and Price are required.");
      return;
    }
    setShowSaveConfirm(true);
  };
  
  const confirmSave = async () => {
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title);
    dataToSend.append('price', `${unformatPrice(formData.price)}`);
    dataToSend.append('description', formData.description);
    dataToSend.append('inclusions', inclusionsText);

    if (imageFile) {
        dataToSend.append('featuredImage', imageFile);
    }

    try {
      // Use apiClientFormData for consistent JWT Bearer token authentication
      await apiClientFormData('/packages', dataToSend, 'POST');

      localStorage.setItem('packageNotification', `Package "${formData.title}" was successfully created.`);
      router.push('/admin/packages');

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
        setShowSaveConfirm(false);
    }
  };

  return (
    <>
      {showSaveConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-bold text-dark-navy mb-4">Confirm Creation</h2>
            <p className="text-slate mb-6">Are you sure you want to create this new package?</p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowSaveConfirm(false)} className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black transition duration-300 cursor-pointer">Cancel</button>
              <button onClick={confirmSave} className="px-6 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white transition duration-300 cursor-pointer">Yes, Create</button>
            </div>
          </div>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold text-dark-navy mb-8">Add New Package</h1>
        
        {error && <p className="bg-red-100 text-red-700 p-3 rounded-md mb-6">{error}</p>}
        
        <form onSubmit={handleSave} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-slate mb-1">Package Title</label>
                    <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g., Daily Dive Package" className="w-full bg-light-gray p-3 rounded-md border border-slate/30"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate mb-1">Price</label>
                    <input 
                        type="text" 
                        name="price"
                        value={formData.price}
                        onChange={handlePriceChange}
                        placeholder="e.g., 1.500.000"
                        className="w-full bg-light-gray p-3 rounded-md border border-slate/30" 
                    />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate mb-1">Description</label>
                <textarea rows={4} name="description" value={formData.description} onChange={handleChange} placeholder="A short description..." className="w-full bg-light-gray p-3 rounded-md border border-slate/30"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate mb-1">Inclusions (one per line)</label>
                <textarea rows={5} name="inclusions" value={inclusionsText} onChange={handleChange} placeholder="- 2x Dives&#10;- Full Equipment" className="w-full bg-light-gray p-3 rounded-md border border-slate/30 font-mono"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate mb-1">Featured Image</label>
                <input type="file" onChange={handleFileChange} className="w-full text-slate border border-slate/30 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-200 file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-gray-300"/>
                {/* Tampilkan pratinjau gambar yang baru dipilih */}
                {imagePreview && (
                    <div className="mt-6 relative w-100 h-100">
                        <Image src={imagePreview} alt="New package preview" fill className="object-cover rounded-md"/>
                    </div>
                )}
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