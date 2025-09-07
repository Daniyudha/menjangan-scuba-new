// src/types/index.ts
export interface HeroSlide {
  id: string;
  headline: string;
  subheadline: string;
  cta: string;
  imageUrl: string;
}

export interface Package {
  id: string;
  title: string;
  price: string;
  description: string;
  inclusions: string[];
}

export interface Article {
  id: string;
  title: string;
  content: string;
  status: 'Published' | 'Draft';
  date: string;
  featuredImage: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  category: string;
}

export interface GalleryCategory {
    id: string;
    name: string;
}

export interface Testimonial {
    id: string;
    name: string;
    quote: string;
    isFeatured: boolean;
}

export interface Submission {
  id: string;
  name: string;
  email: string;
  message: string;
  date: string; // Pastikan ini ada
}