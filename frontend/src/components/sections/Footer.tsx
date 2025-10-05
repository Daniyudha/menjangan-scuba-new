// src/components/sections/Footer.tsx
"use client";

import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/apiClient';
import { Facebook, Instagram, Youtube, Music2, Fish } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { content } from '@/lib/content';

// Tipe data untuk data dinamis dari API
interface SocialLinksData { instagram?: string; facebook?: string; twitter?: string; youtube?: string; }

// Tipe data untuk data semi-statis dari content.ts
interface FooterContent {
    description: string;
    quickLinksTitle: string;
    quickLinks: { href: string; label: string }[];
    servicesTitle: string;
    contactTitle: string;
    services: string[];
    contactInfo: { phone: string; email: string; address: string; };
    copyright: string;
    privacy: string;
    terms: string;
}

export default function Footer() {
    // State untuk data dinamis (social links)
    const [socialLinks, setSocialLinks] = useState<SocialLinksData>({});

    // Data semi-statis bisa kita ambil dari content.ts agar mudah diubah jika perlu
    // Ini adalah fallback jika API gagal atau data tidak ada
    const [footerContent, setFooterContent] = useState<Partial<FooterContent>>({});


    useEffect(() => {
        const fetchFooterData = async () => {
            try {
                // Ambil data settings yang berisi social links
                const settings = await apiClient('/settings');
                if (settings.socialLinks) {
                    setSocialLinks(settings.socialLinks);
                }
                if (settings.footer) {
                    setFooterContent(settings.footer);
                }
            } catch (error) {
                console.error("Failed to fetch footer data, using fallback.", error);
                // Di sini Anda bisa set data fallback dari file content.ts jika diperlukan
            }
        };
        fetchFooterData();
    }, []);

    const services = content.footer.services;
    const quickLinks = content.footer.quickLinks;

    return (
        <footer className="bg-dark-navy pt-20 pb-8 w-full">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">

                    {/* Kolom 1: Logo, Deskripsi, dan Ikon Sosial Media */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center">
                        <Image
                            src="/images/logo/logo-full-white.png"
                            alt="Menjangan Scuba Logo"
                            width={250}
                            height={62}
                            className="object-contain"
                        />
                        </Link>
                        <p className="text-slate">
                            {footerContent.description ??
                                "Explore the mysteries of the ocean and dive into a world full of wonders."}
                        </p>
                        <div className="flex space-x-4 pt-4">
                            {socialLinks.facebook && <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-slate p-2 rounded-full hover:bg-navy hover:text-blue-400 transition-colors"><Facebook size={24} /></a>}
                            {socialLinks.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-slate p-2 rounded-full hover:bg-navy hover:text-blue-400 transition-colors"><Instagram size={24} /></a>}
                            {socialLinks.youtube && <a href={socialLinks.youtube} target="_blank" rel="noopener noreferrer" aria-label="Youtube" className="text-slate p-2 rounded-full hover:bg-navy hover:text-blue-400 transition-colors"><Youtube size={24} /></a>}
                            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" aria-label="Youtube" className="text-slate p-2 rounded-full hover:bg-navy hover:text-blue-400 transition-colors"><Music2 size={24} /></a>}
                        </div>
                    </div>

                    {/* Kolom 2: Quick Links */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-4">
                            {footerContent.quickLinksTitle ?? content.footer.quickLinksTitle}
                        </h4>
                        <ul className="space-y-3">
                            {(footerContent.quickLinks ?? quickLinks).map(link => (
                                <li key={link.href}>
                                    <Link href={link.href} className="text-slate hover:text-blue-400 transition-colors">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 3: Services */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-4">Services</h4>
                        <ul className="space-y-3">
                            {(footerContent.services ?? services).map((service, index) => (
                                <li key={index}><span className="text-slate">{service}</span></li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 4: Contact Us (Data bisa dari backend atau statis) */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-4">Contact Us</h4>
                        <ul className="space-y-3 text-slate">
                            <li>{footerContent.contactInfo?.phone ?? "+62 821-9898-4623"}</li>
                            <li>{footerContent.contactInfo?.email ?? "info@menjanganscuba.com"}</li>
                            <li>{footerContent.contactInfo?.address ?? "Jalan Seririt-Gilimanuk, Pemuteran, Gerokgak, Buleleng Regency, Bali, Indonesia"}</li>
                        </ul>

                    </div>
                </div>

                {/* Garis Pemisah dan Copyright */}
                <div className="mt-16 border-t border-light-navy/20 pt-8 flex flex-col md:flex-row justify-between items-center text-center text-sm text-slate">
                    <p>Copyright ©{new Date().getFullYear()} Menjangan Scuba. All rights reserved.</p>
                    <p>Powered by <span><a className="text-lg font-bold text-light-navy" href="https://www.gegacreative.com/" target='_blank'>Gega Creative</a></span></p>
                </div>
            </div>
        </footer>
    );
};