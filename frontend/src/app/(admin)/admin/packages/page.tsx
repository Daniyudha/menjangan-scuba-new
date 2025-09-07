// src/app/admin/(panel)/packages/page.tsx
"use client";

import { apiClient } from '@/lib/apiClient';
import { formatPrice } from '@/lib/utils';
import { CheckCircle, Edit2, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

// Tipe data untuk paket
interface Package {
  id: string;
  title: string;
  price: string;
  description: string;
  imageUrl: string | null; // imageUrl bisa jadi null
  inclusions: string[];
}

export default function PackagesAdminPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Package | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
  const baseUrl = apiUrl.replace('/api', '');
  
  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true);
        // 2. Gunakan apiClient untuk memastikan cookie terkirim
        const data = await apiClient('/packages');
        setPackages(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();

    // Cek notifikasi dari halaman lain (new/edit)
    const savedNotification = localStorage.getItem('packageNotification');
    if (savedNotification) {
      setNotification(savedNotification);
      localStorage.removeItem('packageNotification');
    }
  }, [apiUrl]); // Array kosong berarti ini hanya berjalan sekali saat komponen mount

  // --- NOTIFICATION LOGIC ---
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // --- DELETE LOGIC ---
  const handleDelete = async () => {
    if (showDeleteConfirm) {
      try {
        // 2. Gunakan apiClient untuk memastikan cookie terkirim
        await apiClient(`/packages/${showDeleteConfirm.id}`, { method: 'DELETE' });
        setPackages(packages.filter(p => p.id !== showDeleteConfirm.id));
        setShowDeleteConfirm(null);
        setNotification(`Package "${showDeleteConfirm.title}" has been deleted.`);
      } catch (err: unknown) {
        setNotification(`Error: ${err instanceof Error ? err.message : 'An unknown error occurred'}`);
        setShowDeleteConfirm(null);
      }
    }
  };
  
  // --- RENDER LOGIC ---
  if (loading) return <div>Loading packages...</div>;
  if (error) return <div className="text-red-500 p-4 bg-red-100 rounded-md">Error: {error}</div>;

  return (
    <>
      {/* Notifikasi (bisa untuk sukses atau error) */}
      {notification && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in-down ${
          notification.startsWith('Error:') ? 'bg-red-500' : 'bg-green-500'
        }`}>
          <CheckCircle size={20} />
          {notification}
        </div>
      )}

      {/* Popup Konfirmasi Hapus */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl text-center">
            <h2 className="text-xl font-bold text-dark-navy mb-4">Are you sure?</h2>
            <p className="text-slate mb-6">
              You are about to delete the package: <br />
              <strong className="text-dark-navy">{showDeleteConfirm.title}</strong>
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowDeleteConfirm(null)} className="px-6 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-black transition duration-300 cursor-pointer">Cancel</button>
              <button onClick={handleDelete} className="px-6 py-2 rounded-md bg-red-500 hover:bg-red-700 text-white transition duration-300 cursor-pointer">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Konten Halaman Utama */}
      <div>
        <div className="flex justify-end mb-6">
          <Link href="/admin/packages/new" className="bg-light-navy text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={18} />
            <span>Add New Package</span>
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <table className="w-full text-left">
            <thead className="bg-gray-100 text-left text-gray-600">
              <tr>
                <th className="p-4 font-semibold text-dark-navy">Title</th>
                <th className="p-4 font-semibold text-dark-navy">Description</th>
                <th className="p-4 font-semibold text-dark-navy">Image</th>
                <th className="p-4 font-semibold text-dark-navy">Price</th>
                <th className="p-4 font-semibold text-dark-navy text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.map(pkg => (
                <tr key={pkg.id} className="border-b border-slate/10 last:border-b-0">
                  <td className="p-4 text-dark-navy font-medium">{pkg.title}</td>
                  <td className="p-4 text-dark-navy font-medium">{pkg.description}</td>
                  <td className="p-4">
                    {/* 3. Tampilkan gambar sebagai pratinjau */}
                    {pkg.imageUrl ? (
                        <div className="relative w-20 h-12 rounded-md overflow-hidden">
                            <Image 
                                src={`${baseUrl}${pkg.imageUrl}`} 
                                alt={pkg.title} 
                                layout="fill"
                                objectFit="cover"
                            />
                        </div>
                    ) : (
                        <span className="text-xs text-slate">No Image</span>
                    )}
                  </td>
                  <td className="p-4 text-slate whitespace-nowrap">{`IDR ${formatPrice(pkg.price)}`}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/packages/edit/${pkg.id}`} className="p-2 text-slate hover:text-blue-400 hover:bg-light-gray rounded-md" title="Edit">
                        <Edit2 size={16} />
                      </Link>
                      <button onClick={() => setShowDeleteConfirm(pkg)} className="p-2 text-slate hover:text-red-500 hover:bg-light-gray rounded-md cursor-pointer" title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}