// src/lib/content.ts

// Tidak ada lagi 'id' dan 'en'. Langsung ke objek konten.
export const content = {
    nav: {
        home: 'Home',
        activities: 'Activities',
        locations: 'Locations',
        about: 'About',
        testimonials: 'Testimonials',
        faq: 'FAQ',
        bookNow: 'Get Started',
    },
    hero: [
        {
            headline: "Embark on an Epic Sea Dive Adventure!",
            subheadline: "Explore the mysteries of the ocean and immerse yourself in the beauty of the sea.",
            cta: "Explore Packages"
        },
        {
            headline: "Discover Spectacular Underwater Worlds",
            subheadline: "Swim alongside vibrant coral reefs and diverse marine life in crystal clear waters.",
            cta: "View Our Courses"
        },
        {
            headline: "Your Unforgettable Journey Awaits",
            subheadline: "Whether you're a beginner or an expert, we have the perfect adventure for you.",
            cta: "Book Your Dive"
        }
    ],
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
    packages: {
        title: 'Choose Your Underwater Adventure',
        subtitle: 'We offer a variety of packages to meet the needs of every adventurer.',
        items: [
            { title: 'Daily Dive Package', price: 'IDR 1,500,000', description: 'Perfect for certified divers wanting to explore the best spots of Menjangan in a day.', inclusions: ['2x Dives', 'Full Equipment', 'Professional Guide', 'Lunch & Mineral Water'] },
            { title: 'Free Diving Package', price: 'IDR 1,200,000', description: 'Experience the freedom of exploring the underwater world on a single breath.', inclusions: ['Breath-hold Session', '2x Free Dive Sessions', 'Expert Guide', 'Weight Belt'] },
            { title: 'Open Water Course', price: 'IDR 5,500,000', description: 'Get your first dive certification with our experienced instructors.', inclusions: ['Theory & Pool Sessions', '4x Ocean Dives', 'International Certification', 'Equipment During Course'] },
            { title: 'Snorkeling Package', price: 'IDR 750,000', description: 'Enjoy the beauty of Menjangan\'s clear surface waters, perfect for the whole family.', inclusions: ['Snorkeling Gear', 'Snorkel Guide', 'Lunch & Mineral Water', 'Visit to 2 Spots'] },
        ]
    },
    // ... (Sisa konten lainnya juga disederhanakan)
    testimonials: {
        title: 'Feedback By Our Members',
        subtitle: 'We value your thoughts and opinions, and we are thrilled to have you as a valued member of our community.',
        items: [
            { quote: "The best diving experience of my life! The team was highly professional, and the underwater scenery of Menjangan is truly magical.", name: "Laura Sutanto", origin: "Jakarta, Indonesia" },
      { quote: "As a beginner, I felt completely safe. The instructor was patient and boosted my confidence. I saw a turtle!", name: "Michael Chen", origin: "Singapore" },
      { quote: "The visibility was insane, like swimming in an aquarium. The dive masters know all the secret spots. Will definitely be back!", name: "David Smith", origin: "Australia" },
        ]
    },
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
    faq: {
        title: 'Frequently Asked Questions',
        subtitle: 'We understand that you may have some questions about our services.',
        items: [
            { q: "How do I book a diving session with Sea Dive?", a: "You can book directly through the 'Get Started' button..." },
            { q: "What should I bring for a diving excursion?", a: "For your diving adventure, we recommend bringing swimwear..." },
            { q: "Are there age restrictions for scuba diving?", a: "Yes, the minimum age for scuba diving is 10 years old..." },
            { q: "How long does a typical diving excursion last?", a: "A typical daily excursion lasts about 6-7 hours..." },
        ]
    },
    footer: {
        description: 'Explore the mysteries of the ocean and dive into a world full of wonders.',
        quickLinksTitle: 'Quick Link',
        servicesTitle: 'Services',
        services: ['Surfing', 'Free Diving', 'Scuba Diving', 'Snorkeling Dive'],
        contactTitle: 'Contact Us',
        contactInfo: {
            phone: '+880 120 123 456',
            email: 'info@menjangan-dive.com',
            address: 'Menjangan Island, Bali, Indonesia'
        },
        copyright: `©${new Date().getFullYear()} MenjanganDive. All rights reserved.`,
        privacy: 'Privacy Policy',
        terms: 'Terms & Services'
    }
};