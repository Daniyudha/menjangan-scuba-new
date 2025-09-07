// src/components/sections/ExperienceSection.tsx
'use client';

import { apiClient } from '@/lib/apiClient';
import { content } from '@/lib/content';
import { Anchor, Award, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

// Tipe data dari API
interface ExperienceData {
  title: string;
  subtitle: string;
  badge: {
    years: string;
    text: string;
  };
  secondaryText: string;
  features: string[];
  cta: string;
  videoUrl: string;
  imageUrl: string;
}

const featureIcons = [Award, Anchor, ShieldCheck];

export default function ExperienceSection() {
  const sectionContent = content.experience;

  // State untuk menyimpan data, loading, dan error
  const [data, setData] = useState<Partial<ExperienceData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = (process.env.NEXT_PUBLIC_API_URL || '').replace('/api', '');

  useEffect(() => {
    const fetchExperienceData = async () => {
      try {
        const settings = await apiClient('/settings');
        if (settings.experience) {
          setData(settings.experience);
        } else {
          throw new Error('Experience data not found in settings.');
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchExperienceData();
  }, []);

  // Ekstrak ID video dari URL untuk embed
  const getYouTubeEmbedUrl = (url: string | undefined) => {
    if (!url) return '';
    try {
      const videoId =
        new URL(url).searchParams.get('v') || url.split('/').pop();
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&rel=0`;
    } catch {
      return ''; // Kembalikan string kosong jika URL tidak valid
    }
  };

  if (loading) {
    return (
      <section id="experience" className="py-10 bg-navy">
        <div className="container mx-auto px-6 w-full animate-pulse">
          <div className="h-24 bg-light-navy/50 rounded-md mb-10"></div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 aspect-square bg-light-navy/50 rounded-2xl"></div>
            <div className="md:col-span-3 aspect-video bg-light-navy/50 rounded-2xl"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="experience" className="py-10 bg-navy">
        <div className="container mx-auto px-6 text-red-400">
          Error: {error}
        </div>
      </section>
    );
  }

  return (
    <section id="experience" className="py-10 bg-navy">
      <div className="container mx-auto px-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
          <div className="md:col-span-2">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight">
              {sectionContent.title}
            </h2>
            <p className="text-slate max-w-lg mt-4">
              {sectionContent.subtitle}
            </p>
          </div>
          <div className="col-span-1 flex justify-start md:justify-end">
            <div className="border-2 rounded-full flex items-center justify-center py-2 px-8 border-l-blue-600 border-b-blue-500 border-t-blue-400 border-r-blue-300">
              <div className="rounded-full bg-navy px-4 py-4 text-center">
                <p className="text-4xl font-bold text-white">10+</p>
                <p className="text-sm text-bright-blue">Years Experience</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mt-10">
          <div className="relative md:col-span-2 border-3 border-white w-full aspect-square rounded-2xl overflow-hidden bg-dark-navy">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0 scale-[1.78]"
              src={getYouTubeEmbedUrl(data.videoUrl)}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
          <div className="relative aspect-square md:aspect-auto md:col-span-3 border-3 border-white w-full h-full rounded-2xl overflow-hidden">
            {data.imageUrl && (
              <Image
                src={`${baseUrl}${data.imageUrl}`}
                alt="Diver with turtle"
                layout="fill"
                objectFit="cover"
              />
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8 items-center">
          <div className="col-span-2">
            <p className="text-slate text-lg max-w-md">
              {sectionContent.secondaryText}
            </p>
          </div>
          <div className="col-span-2">
            <ul className="space-y-4">
              {sectionContent.features.map((feature, index) => {
                const Icon = featureIcons[index];
                return (
                  <li key={index} className="flex items-center gap-4">
                    <Icon className="w-6 h-6 text-bright-blue" />
                    <span className="text-light-slate">{feature}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="lg:col-span-1 md:col-span-4 flex justify-center">
            <a
              href="#contact"
              className="text-white bg-light-navy rounded-full font-bold py-3 px-8 transition-opacity duration-300 mt-4 max-w-max"
            >
              {sectionContent.cta}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
