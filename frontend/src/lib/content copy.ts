// src/lib/content.ts

export const content = {
  // Mengambil SEMUA data dari blok 'en' Anda sebelumnya
  nav: {
    home: 'Home',
    why: 'Why Us',
    packages: 'Packages',
    testimonials: 'Testimonials',
    about: 'About',
    faq: 'FAQ',
    contact: 'Contact',
    bookNow: 'Get Started', // Menggunakan 'Get Started' agar konsisten
  },
  // 'hero' diubah menjadi objek tunggal agar sesuai dengan desain baru
  hero: {
    title1: 'Embark on an Epic',
    title2: 'Sea Dive Adventure!',
    subtitle: 'Explore the mysteries of the ocean and immerse yourself in the beauty of the sea as you embark on a journey like no other.',
    cta: 'Discover More',
  },
  experience: {
    title: 'Deep In A Thrilling Sea Dive Experience',
    subtitle: 'Feel the rush of adrenaline as you descend into the depths surrounded by mesmerizing marine life and breathtaking coral reefs.',
    badge: {
      years: '10+',
      text: 'Years Experience'
    },
    secondaryText: 'Get ready for an exciting underwater adventure like no other. Immerse yourself in a world of vibrant colors, breathtaking marine life, and the peacefulness of the deep blue sea.',
    features: [
      'Experienced guide and boat excursion.',
      'Complimentary tank and weights provided.',
      'Inclusive of all applicable fees and taxes.'
    ],
    cta: 'Learn More'
  },
  // Menambahkan 'activities' yang sebelumnya tidak ada
  activities: {
    title: 'Explore The Wonders Of Sea Diving With Us',
    subtitle: 'Are you ready to plunge into the majestic depths of the underwater world? Look no further!',
    items: [
      { name: 'Surfing', description: 'Conquer the best waves and feel the adrenaline rush.' },
      { name: 'Free Diving', description: 'Experience the freedom of exploring the underwater world on a single breath.' },
      { name: 'Scuba Diving', description: 'Extraordinary scuba diving experiences that will leave you breathless.' },
      { name: 'Snorkeling Dive', description: 'Enjoy the beauty of the clear and colorful surface waters.' },
    ]
  },
  whyMenjangan: {
    title: 'Why Menjangan is Your Dream Dive Destination',
    subtitle: 'Menjangan Island isn\'t just a dive spot; it\'s an extraordinary ecosystem.',
    features: [
      { title: 'Spectacular Coral Reefs', description: 'Explore the diversity of healthy and preserved hard and soft coral reefs.' },
      { title: 'Abundant Marine Life', description: 'Encounter turtles, reef sharks, clownfish, and hundreds of other marine species.' },
      { title: 'Outstanding Visibility', description: 'Enjoy crystal clear water with visibility up to 30-50 meters for an optimal diving experience.' },
      { title: 'Part of a National Park', description: 'Dive in a conservation area that guarantees authenticity and natural preservation.' },
    ],
  },
  packages: {
    title: 'Choose Your Underwater Adventure',
    subtitle: 'We offer a variety of packages to meet the needs of every adventurer.',
    items: [
      { title: 'Daily Dive Package', price: 'IDR 1,500,000', description: 'Perfect for certified divers wanting to explore the best spots of Menjangan in a day.', inclusions: ['2x Dives', 'Full Equipment', 'Professional Guide', 'Lunch & Mineral Water'] },
      { title: 'Free Diving Package', price: 'IDR 1,200,000', description: 'Experience the freedom of exploring the underwater world on a single breath.', inclusions: ['Breath-hold Session', '2x Free Dive Sessions', 'Expert Guide', 'Weight Belt'] },
      { title: 'Open Water Course', price: 'IDR 5,500,000', description: 'Get your first dive certification with our experienced instructors.', inclusions: ['Theory & Pool Sessions', '4x Ocean Dives', 'International Certification', 'Equipment During Course'] },
      { title: 'Snorkeling Package', price: 'IDR 750,000', description: 'Enjoy the beauty of Menjangan\'s clear surface waters, perfect for the whole family.', inclusions: ['Snorkeling Gear', 'Snorkel Guide', 'Lunch & Mineral Water', 'Visit to 2 Spots'] },
    ],
  },
  testimonials: {
    title: 'What Our Divers Say',
    // Mengambil subtitle dari struktur bilingual Anda yang lama
    subtitle: 'We value your thoughts and opinions, and we are thrilled to have you as a valued member of our community.',
    items: [
      { quote: "The best diving experience of my life! The team was highly professional, and the underwater scenery of Menjangan is truly magical.", name: "Laura Sutanto", origin: "Jakarta, Indonesia" },
      { quote: "As a beginner, I felt completely safe. The instructor was patient and boosted my confidence. I saw a turtle!", name: "Michael Chen", origin: "Singapore" },
      { quote: "The visibility was insane, like swimming in an aquarium. The dive masters know all the secret spots. Will definitely be back!", name: "David Smith", origin: "Australia" },
    ]
  },
  // Memastikan 'about' menggunakan key 'values' sesuai kode Anda
  about: {
    title: 'Why Choose Us For Scuba Diving?',
    subtitle: 'Our team comprises highly trained and certified professionals who possess extensive knowledge.',
    values: [
        { title: 'Expert Guides', description: 'Be guided by seasoned dive instructors who know every corner of the waters.' },
        { title: 'Safety First', description: 'We adhere to the highest safety standards with well-maintained equipment.' },
        { title: 'Affordable Price', description: 'Premium quality packages that won\'t break the bank.' },
        { title: 'Eco-Friendly', description: 'We are committed to responsible diving practices to protect our oceans.' },
    ]
  },
  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find quick answers to your questions.',
    items: [
      { q: "Do I need a diving certification?", a: "Yes, for the 'Daily Dive' package, a certification is required..." },
      { q: "What should I bring?", a: "We recommend bringing swimwear, a towel, reef-safe sunscreen..." },
      { q: "Are there any age restrictions?", a: "The minimum age for scuba diving is 10 years old..." },
      { q: "How do we get to Menjangan Island?", a: "Our meeting point is at Lalang Harbor, West Bali..." },
    ]
  },
  // Menambahkan 'finalCta' untuk konsistensi
  finalCta: {
    title: 'Ready To Start Diving?',
    subtitle: 'Are you ready to embark on an unforgettable underwater adventure? Join us now and explore the wonders beneath the waves!',
    cta: 'Get Started'
  },
  // Memastikan 'footer' memiliki semua properti yang dibutuhkan
  footer: {
    description: 'Explore the mysteries of the ocean and dive into a world full of wonders.',
    quickLinksTitle: 'Quick Link',
    servicesTitle: 'Services',
    services: ['Surfing', 'Free Diving', 'Scuba Diving', 'Snorkeling Dive'],
    contactTitle: 'Contact Us',
    contactInfo: {
      phone: '+880 123 456 789',
      email: 'info@mail.com',
      address: '8502 Preston Rd. Inglewood, Maine 98380'
    },
    copyright: `Copyright ©${new Date().getFullYear()} MenjanganDive. All rights reserved.`,
    privacy: 'Privacy Policy',
    terms: 'Terms & Services'
  }
};