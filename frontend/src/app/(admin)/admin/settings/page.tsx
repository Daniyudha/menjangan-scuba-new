// src/app/admin/(panel)/settings/page.tsx
"use client";

import { apiClient, apiClientFormData } from "@/lib/apiClient";
import { CheckCircle, Edit2, Facebook, Image as ImageIcon, Instagram, Link as LinkIcon, Music2, Save, Youtube } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

// Tipe data
interface HeroSlide { id: string; headline: string; subheadline: string; cta: string; imageUrl: string; }
interface ExperienceData { videoUrl: string; imageUrl: string; }
interface SocialLinksData { instagram: string; facebook: string; twitter: string; youtube: string; }
interface SettingsData { hero: HeroSlide[]; experience: ExperienceData; socialLinks: SocialLinksData; }

const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const apiUrl = `${baseUrl}/api`;

export default function SettingsPage() {
    // STATE UNTUK DATA
    const [settings, setSettings] = useState<Partial<SettingsData>>({});
    const [originalSettings, setOriginalSettings] = useState<Partial<SettingsData>>({});
    const [uploading, setUploading] = useState<{ [key: string]: boolean }>({}); // State loading untuk upload


    // STATE UNTUK KONTROL UI
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notification, setNotification] = useState<string | null>(null);
    const [isHeroEditing, setIsHeroEditing] = useState(false);
    const [isExperienceEditing, setIsExperienceEditing] = useState(false);
    const [isSocialEditing, setIsSocialEditing] = useState(false);

    // STATE UNTUK FILE UPLOAD
    const [experienceImageFile, setExperienceImageFile] = useState<File | null>(null);
    const [heroImagePreviews, setHeroImagePreviews] = useState<{ [key: string]: string }>({});
    const [experienceImagePreview, setExperienceImagePreview] = useState<string | null>(null);


    // --- DATA FETCHING & NOTIFICATION TIMER ---
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await apiClient(`/settings`, { credentials: 'include' });
                setSettings(data);
                setOriginalSettings(data);
            } catch (err: unknown) { setError(err instanceof Error ? err.message : 'An unknown error occurred'); }
            finally { setLoading(false); }
        };
        fetchSettings();
    }, []);

    const fetchAllSettings = async () => {
        try {
            const data = await apiClient('/settings');
            setSettings(data);
            setOriginalSettings(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchAllSettings().finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => setNotification(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

    // --- FORM HANDLERS ---
    const handleChange = (e: ChangeEvent<HTMLInputElement>, section: 'hero' | 'experience' | 'socialLinks', index?: number) => {
        const { name, value } = e.target;
        setSettings(prev => {
            const newSettings = JSON.parse(JSON.stringify(prev)); // Deep copy
            if (section === 'hero' && typeof index === 'number' && newSettings.hero) {
                newSettings.hero[index] = { ...newSettings.hero[index], [name]: value };
            } else if (section === 'experience' && newSettings.experience) {
                newSettings.experience = { ...newSettings.experience, [name]: value };
            } else if (section === 'socialLinks' && newSettings.socialLinks) {
                newSettings.socialLinks = { ...newSettings.socialLinks, [name]: value };
            }
            return newSettings;
        });
    };

    const handleHeroFileChange = async (e: ChangeEvent<HTMLInputElement>, slideId: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(prev => ({ ...prev, [slideId]: true })); // Mulai loading

        const formData = new FormData();
        formData.append('heroImage', file);
        formData.append('slideId', slideId);

        // Debug: Log API URL and FormData contents
        console.log('API URL:', `${apiUrl}/settings/hero/image`);
        console.log('FormData entries:');
        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch(`${apiUrl}/settings/hero/image`, {
                method: 'POST',
                body: formData,
                credentials: 'include',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            
            console.log('Response status:', response.status, response.statusText);
            
            if (!response.ok) {
                // Try to get error message from response
                let errorMessage = `Server returned ${response.status}: ${response.statusText}`;
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    const errorText = await response.text();
                    errorMessage = errorText || errorMessage;
                }
                console.error('Upload failed with details:', errorMessage);
                throw new Error(errorMessage);
            }

            const result = await response.json();
            console.log('Upload successful, server response:', result);
            
            if (!result.imageUrl) {
                throw new Error('Server response missing imageUrl field');
            }

            const newImageUrl = result.imageUrl;
            console.log('New image URL from server:', newImageUrl);

            // Update local state with the new image URL
            setSettings(prev => {
                if (!prev.hero) return prev;
                const newHero = prev.hero.map(slide =>
                    slide.id === slideId ? { ...slide, imageUrl: newImageUrl } : slide
                );
                return { ...prev, hero: newHero };
            });

            setNotification(`Hero image uploaded successfully!`);
            console.log('Local state updated with new image');

        } catch (error: unknown) {
            console.error('Hero image upload error details:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            setNotification(`Upload failed: ${errorMessage}`);
            
            // Check for common issues
            if (error instanceof Error) {
                if (error.message.includes('Network')) {
                    console.error('Network error - check if backend server is running');
                }
                if (error.message.includes('401')) {
                    console.error('Authentication error - check if user is logged in');
                }
                if (error.message.includes('413')) {
                    console.error('File too large - maximum size is 5MB');
                }
                if (error.message.includes('400')) {
                    console.error('Bad request - check file type (JPEG, PNG, etc.)');
                }
            }
        } finally {
            setUploading(prev => ({ ...prev, [slideId]: false }));
        }
    };

    const handleExperienceFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setExperienceImageFile(file);
            setExperienceImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCancel = (section: keyof SettingsData) => {
        setSettings(originalSettings);
        if (section === 'hero') { setIsHeroEditing(false); setHeroImagePreviews({}); }
        if (section === 'experience') { setIsExperienceEditing(false); setExperienceImageFile(null); setExperienceImagePreview(null); }
        if (section === 'socialLinks') setIsSocialEditing(false);
    };


    // --- SAVE HANDLERS ---
    const handleSaveHero = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Sekarang kita hanya mengirim data teks (termasuk URL gambar yang sudah diperbarui)
            await apiClient('/settings/hero', {
                method: "PUT",
                body: JSON.stringify(settings.hero),
            });

            // Fetch ulang data untuk sinkronisasi
            const data = await apiClient('/settings');
            setSettings(data);
            setOriginalSettings(data);

            setNotification("Hero Section saved successfully!");
            setIsHeroEditing(false);

        } catch (error: unknown) {
            setNotification(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        }
    };

    const handleSaveExperience = async (e: FormEvent) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append('videoUrl', settings.experience?.videoUrl || '');
            if (experienceImageFile) {
                formData.append('experienceImage', experienceImageFile);
            }

            // Use apiClientFormData instead of direct fetch
            await apiClientFormData('/settings/experience', formData, 'PUT');

            // Fetch updated settings
            await fetchAllSettings();

            setNotification("Experience Section saved successfully!");
            setIsExperienceEditing(false);
            setExperienceImageFile(null);
            setExperienceImagePreview(null);
        } catch (error: unknown) {
            setNotification(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        }
    };

    const handleSaveSocial = async (e: FormEvent) => {
        e.preventDefault();
        try {
            // Gunakan apiClient untuk data JSON
            const finalData = await apiClient('/settings/social', {
                method: "PUT",
                body: JSON.stringify(settings.socialLinks),
            });

            setSettings(prev => ({ ...prev, socialLinks: finalData.data }));
            setOriginalSettings(prev => ({ ...prev, socialLinks: finalData.data }));
            setNotification("Social Media links saved successfully!");
            setIsSocialEditing(false);
        } catch (error: unknown) { setNotification(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`); }
    };

    // --- RENDER LOGIC ---
    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {notification && <div className={`fixed top-5 left-1/2 -translate-x-1/2 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-down ${notification.startsWith('Error:') ? 'bg-red-500' : 'bg-green-500'}`}><CheckCircle size={20} className="inline mr-2" />{notification}</div>}
            <h1 className="text-3xl font-bold text-dark-navy mb-8">Site Content Settings</h1>
            <div className="space-y-8">
                {/* HERO SECTION CARD */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-dark-navy">Hero Section Slides</h2>
                        {isHeroEditing ? (
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => handleCancel('hero')} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md cursor-pointer">Cancel</button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => setIsHeroEditing(true)} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md cursor-pointer"><Edit2 size={16} /><span className="text-sm font-semibold">Edit</span></button>
                        )}
                    </div>
                    {isHeroEditing ? (
                        <form onSubmit={handleSaveHero}>
                            <div className="space-y-8">
                                {settings.hero?.map((slide, index) => (
                                    <div key={slide.id || index} className="p-4 border-l-4 border-bright-blue bg-light-gray rounded-r-md">
                                        <p className="font-bold text-dark-navy mb-4">Slide {index + 1}</p>
                                        <div className="space-y-4">
                                            <div><label className="block text-sm font-medium text-slate mb-1">Headline</label><input type="text" name="headline" value={slide.headline || ''} onChange={(e) => handleChange(e, 'hero', index)} className="w-full bg-white p-3 rounded-md border border-slate/30" /></div>
                                            <div><label className="block text-sm font-medium text-slate mb-1">Subheadline</label><input type="text" name="subheadline" value={slide.subheadline || ''} onChange={(e) => handleChange(e, 'hero', index)} className="w-full bg-white p-3 rounded-md border border-slate/30" /></div>
                                            <div><label className="block text-sm font-medium text-slate mb-1">Button Text (CTA)</label><input type="text" name="cta" value={slide.cta || ''} onChange={(e) => handleChange(e, 'hero', index)} className="w-full bg-white p-3 rounded-md border border-slate/30" /></div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate mb-1">Background Image (maximum size is 5MB)</label>
                                                <input type="file" onChange={(e) => handleHeroFileChange(e, slide.id)} className="w-full text-slate border border-slate/30 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-200 file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-gray-300" />
                                                {uploading[slide.id] && <p className="text-xs text-slate animate-pulse mt-2">Uploading...</p>}
                                                <div className="mt-6 text-xs text-slate">
                                                    Current image preview:
                                                </div>
                                                <div className="mt-2 relative max-w-200 h-100">
                                                    {slide.imageUrl && <Image src={`${baseUrl}${slide.imageUrl}`} alt="Current image" fill className="object-cover rounded-md" />}
                                                    {heroImagePreviews[slide.id] ? (
                                                        <Image src={heroImagePreviews[slide.id]} alt="New image preview" fill className="object-cover rounded-md" />
                                                    ) : slide.imageUrl ? (
                                                        <Image src={`${baseUrl}${slide.imageUrl}`} alt="Current image" fill className="object-cover rounded-md" />
                                                    ) : (
                                                        <div className="w-full h-full bg-light-gray flex items-center justify-center text-xs text-slate rounded-md">No Image</div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-slate/20">
                                <button type="button" onClick={() => handleCancel('hero')} className="px-6 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-black transition duration-300 cursor-pointer">Cancel</button>
                                <button type="submit" className="bg-light-navy px-4 py-2 text-white rounded-md flex items-center gap-2 transition duration-300 cursor-pointer"><Save size={16} /> Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div className="space-y-6">
            {settings.hero?.map((slide, index) => (
                <div key={slide.id} className="flex items-start gap-4 p-4 rounded-md bg-light-gray">
                    <div className="relative w-32 h-16 rounded-md overflow-hidden flex-shrink-0">
                        {slide.imageUrl ? (
                            <Image src={`${baseUrl}${slide.imageUrl}`} alt={slide.headline} layout="fill" objectFit="cover" />
                        ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-xs text-slate">No Image</div>
                        )}
                    </div>
                    <div className="text-sm">
                        <p className="font-semibold text-dark-navy">Slide {index + 1}: {slide.headline}</p>
                        <p className="text-slate italic mt-1">&quot;{slide.subheadline}&quot;</p>
                    </div>
                </div>
            ))}
        </div>
                    )}
                </div>

                {/* EXPERIENCE SECTION CARD */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-dark-navy">Experience Section Media</h2>
                        {isExperienceEditing ? (
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => handleCancel('experience')} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md cursor-pointer">Cancel</button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => setIsExperienceEditing(true)} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md cursor-pointer"><Edit2 size={16} /><span className="text-sm font-semibold">Edit</span></button>
                        )}
                    </div>
                    {isExperienceEditing ? (
                        <form onSubmit={handleSaveExperience} className="space-y-6">
                            <div><label className="flex items-center gap-2 text-sm font-medium text-slate mb-1"><LinkIcon size={14} /> YouTube Video URL</label><input type="url" name="videoUrl" value={settings.experience?.videoUrl || ''} onChange={(e) => handleChange(e, 'experience')} className="w-full bg-light-gray p-3 rounded-md border border-slate/30" /></div>
                            <div>
                                <label className="flex items-center gap-2 text-sm font-medium text-slate mb-1">
                                    <ImageIcon size={14} /> Featured Image (maximum size is 5MB)
                                </label>
                                <input
                                    type="file"
                                    onChange={handleExperienceFileChange}
                                    className="w-full text-slate border border-slate/30 rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:bg-gray-200 file:text-sm file:font-semibold file:cursor-pointer hover:file:bg-gray-300"
                                />
                                <div className="mt-6 text-xs text-slate">
                                    Current image preview:
                                </div>
                                <div className="mt-2 relative max-w-200 h-100">
                                    {experienceImagePreview ? (
                                        <Image src={experienceImagePreview} alt="New image preview" fill className="object-cover rounded-md" />
                                    ) : settings.experience?.imageUrl ? (
                                        <Image src={`${baseUrl}${settings.experience.imageUrl}`} alt="Current image" fill className="object-cover rounded-md" />
                                    ) : (
                                        <div className="w-full h-full bg-light-gray flex items-center justify-center text-xs text-slate rounded-md">No Image</div>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-slate/20">
                                <button type="button" onClick={() => handleCancel('experience')} className="px-6 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-black transition duration-300 cursor-pointer">Cancel</button>
                                <button type="submit" className="bg-light-navy px-4 py-2 text-white rounded-md flex items-center gap-2 transition duration-300 cursor-pointer"><Save size={16} /> Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="font-semibold text-dark-navy mb-2">Video Preview</p>
                                <div className="aspect-video relative rounded-lg overflow-hidden border">
                                    {settings.experience?.videoUrl && settings.experience.videoUrl.includes('youtube.com') ? (<iframe className="absolute top-0 left-0 w-full h-full" src={`https://www.youtube.com/embed/${new URL(settings.experience.videoUrl).searchParams.get('v') || settings.experience.videoUrl.split('/').pop()}`} title="YouTube video preview" allowFullScreen></iframe>) : (<div className="flex items-center justify-center h-full bg-light-gray text-slate">No valid video URL</div>)}
                                </div>
                            </div>
                            <div>
                                <p className="font-semibold text-dark-navy mb-2">Image Preview</p>
                                <div className="aspect-video relative rounded-lg overflow-hidden border">
                                    {settings.experience?.imageUrl ? (<Image src={`${baseUrl}${settings.experience.imageUrl}`} alt="Experience" fill className="object-cover" />) : (<div className="flex items-center justify-center h-full bg-light-gray text-slate">No image set</div>)}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* SOCIAL MEDIA LINKS CARD */}
                <div className="bg-white p-8 rounded-lg shadow-lg">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-dark-navy">Social Media Links</h2>
                        {/* {!isSocialEditing && <button type="button" onClick={() => setIsSocialEditing(true)} className="flex items-center gap-2 text- bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded-md cursor-pointer"><Edit2 size={16} /><span>Edit</span></button>} */}
                        {isSocialEditing ? (
                            <div className="flex items-center gap-4">
                                <button type="button" onClick={() => handleCancel('socialLinks')} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md cursor-pointer">Cancel</button>
                            </div>
                        ) : (
                            <button type="button" onClick={() => setIsSocialEditing(true)} className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 py-2 px-4 rounded-md cursor-pointer"><Edit2 size={16} /><span className="text-sm font-semibold">Edit</span></button>
                        )}
                    </div>
                    {isSocialEditing ? (
                        <form onSubmit={handleSaveSocial}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate mb-1">Instagram</label>
                                    <input name="instagram" value={settings.socialLinks?.instagram || ''} onChange={(e) => handleChange(e, 'socialLinks')} className="w-full bg-light-gray p-3 rounded-md border border-slate/30" placeholder="Instagram URL" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate mb-1">Facebook</label>
                                    <input name="facebook" value={settings.socialLinks?.facebook || ''} onChange={(e) => handleChange(e, 'socialLinks')} className="w-full bg-light-gray p-3 rounded-md border border-slate/30" placeholder="Facebook URL" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate mb-1">Tiktok</label>
                                    <input name="twitter" value={settings.socialLinks?.twitter || ''} onChange={(e) => handleChange(e, 'socialLinks')} className="w-full bg-light-gray p-3 rounded-md border border-slate/30" placeholder="Tiktok URL" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate mb-1">Youtube</label>
                                    <input name="youtube" value={settings.socialLinks?.youtube || ''} onChange={(e) => handleChange(e, 'socialLinks')} className="w-full bg-light-gray p-3 rounded-md border border-slate/30" placeholder="YouTube URL" />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 mt-6 pt-6 border-t border-slate/20">
                                <button type="button" onClick={() => handleCancel('socialLinks')} className="px-6 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-black transition duration-300 cursor-pointer">Cancel</button>
                                <button type="submit" className="bg-light-navy px-4 py-2 text-white rounded-md flex items-center gap-2 transition duration-300 cursor-pointer"><Save size={16} /> Save Changes</button>
                            </div>
                        </form>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3"><Instagram className="text-slate" /><a href={settings.socialLinks?.instagram || '#'} target="_blank" rel="noreferrer" className="text-slate hover:text-bright-blue underline truncate">{settings.socialLinks?.instagram || "Not set"}</a></div>
                            <div className="flex items-center gap-3"><Facebook className="text-slate" /><a href={settings.socialLinks?.facebook || '#'} target="_blank" rel="noreferrer" className="text-slate hover:text-bright-blue underline truncate">{settings.socialLinks?.facebook || "Not set"}</a></div>
                            <div className="flex items-center gap-3"><Music2 className="text-slate" /><a href={settings.socialLinks?.twitter || '#'} target="_blank" rel="noreferrer" className="text-slate hover:text-bright-blue underline truncate">{settings.socialLinks?.twitter || "Not set"}</a></div>
                            <div className="flex items-center gap-3"><Youtube className="text-slate" /><a href={settings.socialLinks?.youtube || '#'} target="_blank" rel="noreferrer" className="text-slate hover:text-bright-blue underline truncate">{settings.socialLinks?.youtube || "Not set"}</a></div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}