// src/app/(public)/testimonials/page.tsx
"use client";

import TestimonialsSection from '@/components/sections/TestimonialsSection';
import { Star } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, FormEvent, useState } from 'react';

const ReviewSubmissionSection = () => {
  const [formData, setFormData] = useState({ name: '', origin: '', quote: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const googleReviewUrl = "https://g.page/r/YOUR_GOOGLE_BUSINESS_ID/review";

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNotification(null);

    const dataToSend = new FormData();
    dataToSend.append('name', formData.name);
    dataToSend.append('origin', formData.origin);
    dataToSend.append('quote', formData.quote);
    if (avatarFile) {
      dataToSend.append('avatar', avatarFile); // Nama field 'avatar' harus cocok
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/testimonials`, {
        method: 'POST',
        body: dataToSend,
      });
      if (!response.ok) throw new Error('Failed to submit testimonial.');

      setNotification("Thank you! Your testimonial has been submitted for review.");
      setFormData({ name: '', origin: '', quote: '' });
      setAvatarFile(null);
      setAvatarPreview(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 bg-navy">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white">Share Your Adventure</h2>
          <p className="max-w-3xl mx-auto mt-4 text-slate">
            Had an unforgettable time with us? We&apos;d love to hear your story. 
            Choose your preferred way to leave a review below.
          </p>
        </div>

        {/* Layout 2 kolom di desktop, 1 kolom di mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Kolom Kiri: Formulir Testimoni Internal */}
          <div className="bg-dark-navy p-8 rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-6">Write a Testimonial</h3>
            {notification && <p className="bg-green-500/20 text-green-300 p-3 rounded-md mb-4">{notification}</p>}
            {error && <p className="bg-red-500/20 text-red-300 p-3 rounded-md mb-4">{error}</p>}
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label htmlFor="name" className="block text-light-slate mb-2">Your Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-navy border border-light-navy/50 rounded-md p-3 text-white focus:ring-2 focus:ring-bright-blue transition"/>
              </div>
              <div>
                <label htmlFor="origin" className="block text-light-slate mb-2">Your Location (e.g., &quot;Jakarta, Indonesia&quot;)</label>
                <input type="text" id="origin" name="origin" value={formData.origin} onChange={handleChange} className="w-full bg-navy border border-light-navy/50 rounded-md p-3 text-white focus:ring-2 focus:ring-bright-blue transition"/>
              </div>
              <div>
                <label htmlFor="quote" className="block text-light-slate mb-2">Your Experience (Quote)</label>
                <textarea id="quote" name="quote" value={formData.quote} onChange={handleChange} required rows={5} className="w-full bg-navy border border-light-navy/50 rounded-md p-3 text-white focus:ring-2 focus:ring-bright-blue transition"></textarea>
              </div>
              <div>
                <label htmlFor="avatar" className="block text-light-slate mb-2">Upload a Photo (Optional)</label>
                <input type="file" id="avatar" name="avatar" onChange={handleFileChange} accept="image/*" className="w-full text-slate border border-light-navy/50 text-white rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-white file:text-black hover:file:bg-gray-200"/>
                {avatarPreview && (
                  <div className="mt-4 relative w-24 h-24 rounded-full overflow-hidden">
                    <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover"/>
                  </div>
                )}
              </div>
              <button type="submit" className="bg-light-navy text-white py-2  w-full md:w-auto cursor-pointer rounded-lg transition duration-400" disabled={isLoading}>
                {isLoading ? 'Submitting...' : 'Submit Testimonial'}
              </button>
            </form>
          </div>

          

          {/* Kolom Kanan: Ajakan ke Google Reviews */}
          <div className="bg-dark-navy p-8 rounded-2xl text-center flex flex-col items-center justify-center h-full">
             <h3 className="text-2xl font-bold text-white">Or Review Us on Google</h3>
             <p className="text-slate my-4">
                Your review on Google helps other divers find us and is incredibly valuable. Thank you for your support!
             </p>
             <div className="flex text-yellow-400 my-4">
                <Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" /><Star className="fill-current" />
             </div>
             <a 
                href={googleReviewUrl}
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-light-navy text-white py-2 px-6 rounded-lg hover:bg-light-navy/80 transition duration-400"
            >
                Go to Google Reviews
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};

export default function TestimonialsPage() {
  return (
    <div className="pt-24">
      <TestimonialsSection />
      <ReviewSubmissionSection />
    </div>
  );
}