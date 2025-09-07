export const mockPackages = [
    { id: '1', title: 'Daily Dive Package', price: 'IDR 1,500,000', description: 'Perfect for certified divers...' },
    { id: '2', title: 'Free Diving Package', price: 'IDR 1,200,000', description: 'Experience the freedom...' },
    { id: '3', title: 'Open Water Course', price: 'IDR 5,500,000', description: 'Get your first dive certification...' },
    { id: '4', title: 'Snorkeling Package', price: 'IDR 750,000', description: 'Enjoy the beauty of the surface...' },
];

export const mockArticles = [
    { id: 'a1', title: 'Top 5 Dive Sites in Menjangan', status: 'Published', date: '2023-10-26' },
    { id: 'a2', title: 'A Guide to Underwater Photography', status: 'Draft', date: '2023-11-15' },
];

export const mockGalleryCategories = [
    { id: 'cat1', name: 'Coral Reefs' },
    { id: 'cat2', name: 'Marine Life' },
    { id: 'cat3', name: 'Divers in Action' },
    { id: 'cat4', name: 'Boats & Scenery' },
];

export const mockGalleryImages = [
  { id: 'g1', url: '/images/gallery-1.jpg', caption: 'Vibrant Coral Garden', category: 'Coral Reefs' },
  { id: 'g2', url: '/images/gallery-2.jpg', caption: 'Close Encounter with a Turtle', category: 'Marine Life' },
  { id: 'g3', url: '/images/gallery-3.jpg', caption: 'A School of Yellow Tangs', category: 'Marine Life' },
  { id: 'g4', url: '/images/gallery-4.jpg', caption: 'Exploring the Depths', category: 'Divers in Action' },
  { id: 'g5', url: '/images/gallery-5.jpg', caption: 'Sunset Over the Dive Boat', category: 'Boats & Scenery' },
  { id: 'g6', url: '/images/gallery-6.jpg', caption: 'Macro Shot of a Nudibranch', category: 'Marine Life' },
];

export const mockTestimonials = [
    { id: 't1', name: 'Lucy Aprilia', quote: 'The experience was truly exceptional...', isFeatured: true },
    { id: 't2', name: 'Michael Chen', quote: 'As a beginner, I felt completely safe...', isFeatured: true },
    { id: 't3', name: 'David Smith', quote: 'The visibility was insane...', isFeatured: false },
];

export const mockSubmissions = [
    { id: 's1', name: 'John Doe', email: 'john@example.com', message: 'I would like to inquire about group discounts.', date: '2023-12-01' },
    { id: 's2', name: 'Jane Smith', email: 'jane@example.com', message: 'What is the best time of year to dive?', date: '2023-12-02' },
]

export interface HeroSlide {
    id: string;
    headline: string;
    subheadline: string;
    cta: string;
}
// Mock data for Hero and Experience sections
export const mockHeroSlides: HeroSlide[] = [
    {
        id: 'h1',
        headline: 'Embark on an Epic Sea Dive Adventure!',
        subheadline: 'Explore the mysteries of the ocean and immerse yourself in the beauty of the sea.',
        cta: 'Explore Packages'
    },
    {
        id: 'h2',
        headline: 'Discover Spectacular Underwater Worlds',
        subheadline: 'Swim alongside vibrant coral reefs and diverse marine life in crystal clear waters.',
        cta: 'View Our Courses'
    },
    {
        id: 'h3',
        headline: 'Your Unforgettable Journey Awaits',
        subheadline: 'Whether you\'re a beginner or an expert, we have the perfect adventure for you.',
        cta: 'Book Your Dive'
    }
];

// ...
export const mockSiteContent = {
    hero: mockHeroSlides, // Referensi ke data baru
    experience: {
        videoUrl: 'https://www.youtube.com/shorts/s6m8Shicooc',
        imageUrl: '/images/experience.jpg',
    }
}

export const mockSocialLinks = {
    instagram: "https://instagram.com/menjanganscuba_official",
    facebook: "https://facebook.com/menjanganscuba",
    twitter: "https://twitter.com/menjanganscuba",
    youtube: "https://youtube.com/channel/yourchannelid"
};