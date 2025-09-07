// src/data/db.ts
import { HeroSlide, Package, Article, GalleryImage, GalleryCategory, Testimonial } from "../types";

// This is our in-memory "database".
// It will reset every time the server restarts.
// In a real application, this would connect to a real database like PostgreSQL or MongoDB.

interface Database {
  packages: Package[];
  articles: Article[];
  galleryImages: GalleryImage[];
  galleryCategories: GalleryCategory[];
  testimonials: Testimonial[];
  settings: {
    hero: HeroSlide[];
    experience: {
      videoUrl: string;
      imageUrl: string;
    };
    socialLinks: {
      instagram: string;
      facebook: string;
      twitter: string;
      youtube: string;
    };
  };
  submissions: any[];
}

export let db: Database = {
  packages: [
    { id: '1', title: 'Daily Dive Package', price: 'IDR 1,500,000', description: 'Perfect for certified divers...', inclusions: ['2x Dives', 'Full Equipment'] },
    { id: '2', title: 'Free Diving Package', price: 'IDR 1,200,000', description: 'Experience the freedom...', inclusions: ['Breath-hold Session', 'Expert Guide'] },
    { id: '3', title: 'Open Water Course', price: 'IDR 5,500,000', description: 'Get your first dive certification...', inclusions: ['4x Ocean Dives', 'Certification'] },
    { id: '4', title: 'Snorkeling Package', price: 'IDR 750,000', description: 'Enjoy the beauty of the surface...', inclusions: ['Snorkeling Gear', 'Guide'] },
  ],
  articles: [
    { id: 'a1', title: 'Top 5 Dive Sites in Menjangan', status: 'Published', date: '2023-10-26', content: '<p>The marine life in Menjangan is <strong>spectacular</strong>.</p>', featuredImage: '/uploads/default-article.jpg' },
    { id: 'a2', title: 'A Guide to Underwater Photography', status: 'Draft', date: '2023-11-15', content: '<p>Capturing the perfect shot requires practice.</p>', featuredImage: '/uploads/default-article.jpg' },
  ],
  galleryImages: [
    { id: 'g1', url: '/uploads/gallery-1.jpg', caption: 'Vibrant Coral Garden', category: 'Coral Reefs' },
    { id: 'g2', url: '/uploads/gallery-2.jpg', caption: 'Close Encounter with a Turtle', category: 'Marine Life' },
  ],
  galleryCategories: [
    { id: 'cat1', name: 'Coral Reefs' },
    { id: 'cat2', name: 'Marine Life' },
    { id: 'cat3', name: 'Divers in Action' },
  ],
  testimonials: [
    { id: 't1', name: 'Lucy Aprilia', quote: 'The experience was truly exceptional...', isFeatured: true },
    { id: 't2', name: 'Michael Chen', quote: 'As a beginner, I felt completely safe...', isFeatured: true },
    { id: 't3', name: 'David Smith', quote: 'The visibility was insane...', isFeatured: false },
  ],
  settings: {
    hero: [
      { id: 'h1', headline: 'Embark on an Epic Sea Dive Adventure!', subheadline: 'Explore the mysteries of the ocean...', cta: 'Explore Packages', imageUrl: "/uploads/hero1.jpg" },
      { id: 'h2', headline: 'Discover Spectacular Underwater Worlds', subheadline: 'Swim alongside vibrant coral reefs...', cta: 'View Our Courses', imageUrl: "/uploads/hero2.jpg" },
      { id: 'h3', headline: 'Your Unforgettable Journey Awaits', subheadline: 'Whether you\'re a beginner...', cta: 'Book Your Dive', imageUrl: "/uploads/hero3.jpg" },
    ],
    experience: {
      videoUrl: 'https://www.youtube.com/watch?v=yZq3X_4Y_2I',
      imageUrl: '/uploads/experience.jpg',
    },
    socialLinks: {
      instagram: "https://instagram.com/menjanganscuba_official",
      facebook: "https://facebook.com/menjanganscuba",
      twitter: "",
      youtube: ""
    }
  },
  submissions: [
    { id: 's1', name: 'John Doe', email: 'john@example.com', message: 'I would like to inquire about group discounts.', date: '2023-12-01' },
  ]
};