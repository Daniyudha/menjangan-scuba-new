// src/components/sections/ContactSection.tsx
"use client";

import { apiClient } from '@/lib/apiClient'; // Kita bisa gunakan apiClient
import { content } from '@/lib/content';
import { CheckCircle, Mail, MapPin, Phone } from 'lucide-react';
import { ChangeEvent, FormEvent, useState } from 'react';

// Tipe data untuk form
interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const ContactSection = () => {
  // --- STATE MANAGEMENT ---
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  });
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Data statis dari content.ts
  const contactContent = content.footer;
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15813.79586141444!2d114.61198642751465!3d-8.05584523282203!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd160d50711a6ef%3A0x6c6a51d4f04f10ab!2sLabuhan%20Lalang!5e0!3m2!1sen!2sid!4v1691234567890!5m2!1sen!2sid";

  // --- HANDLERS ---
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setNotification(null);

    try {
      // Endpoint /api/submissions tidak memerlukan otentikasi
      await apiClient('/submissions', {
        method: 'POST',
        body: JSON.stringify(formData),
      });

      setNotification("Thank you for your message! We'll get back to you soon.");
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-dark-navy">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white">Get In Touch</h1>
          <p className="max-w-2xl mx-auto mt-4 text-slate">
            Have questions or ready to book your dive? Reach out to us!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          <div className="flex flex-col gap-6">
            {/* Tampilkan notifikasi atau error di atas form */}
            {notification && <div className="bg-green-500/20 text-green-300 p-4 rounded-md flex items-center gap-2"><CheckCircle size={20} />{notification}</div>}
            {error && <div className="bg-red-500/20 text-red-300 p-4 rounded-md">{error}</div>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div>
                <label htmlFor="name" className="block text-light-slate mb-2">Full Name</label>
                <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-navy border border-light-navy/50 rounded-md p-3 text-white"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-light-slate mb-2">Email Address</label>
                <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-navy border border-light-navy/50 rounded-md p-3 text-white"/>
              </div>
              <div>
                <label htmlFor="message" className="block text-light-slate mb-2">Message</label>
                <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full bg-navy border border-light-navy/50 rounded-md p-3 text-white"></textarea>
              </div>
              <button type="submit" className="bg-light-navy cursor-pointer text-white py-2 px-6 rounded-lg hover:bg-bright-blue/80 transition duration-400" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>

          <div className="flex flex-col gap-10">
            <div className="bg-navy p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <ul className="space-y-4 text-slate">
                <li className="flex items-center gap-4"><Phone className="w-6 h-6 text-bright-blue"/><span>{contactContent.contactInfo.phone}</span></li>
                <li className="flex items-center gap-4"><Mail className="w-6 h-6 text-bright-blue"/><span>{contactContent.contactInfo.email}</span></li>
                <li className="flex items-start gap-4"><MapPin className="w-6 h-6 text-bright-blue mt-1"/><span>{contactContent.contactInfo.address}</span></li>
              </ul>
            </div>
            <div className="w-full aspect-video rounded-lg overflow-hidden">
              <iframe src={mapEmbedUrl} className="w-full h-full border-0" allowFullScreen={false} loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
