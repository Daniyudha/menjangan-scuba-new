// src/components/sections/ActivitiesSection.tsx
"use client";

import Image from 'next/image';
import { content } from '@/lib/content';

const activityImages = [
   "/images/surfing.jpg",
    "/images/free-diving.jpg",
    "/images/dive-course.jpg",
    "/images/snorkeling.jpg"
];

const ActivitiesSection = () => {
    const sectionContent = content.activities;

    return (
        <section id="activities" className="py-20 bg-dark-navy">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                    {sectionContent.title}
                </h2>
                <p className="max-w-2xl mx-auto mb-12 text-slate">
                    {sectionContent.subtitle}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {sectionContent.items.map((activity, index) => (
                        <div 
                            key={index} 
                            className="relative h-96 w-full rounded-2xl overflow-hidden group shadow-lg shadow-black/30"
                        >
                            <Image
                                src={activityImages[index]}
                                alt={activity.name}
                                layout="fill"
                                objectFit="cover"
                                className="rounded-2xl group-hover:scale-110 transition-transform duration-500 ease-in-out"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 rounded-2xl" />
                            <div className="absolute inset-0 border-2 border-white/70 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-center items-center text-center text-white transition-all duration-500 ease-in-out md:group-hover:justify-end md:group-hover:pb-8">
                                <h3 className="text-2xl font-bold">{activity.name}</h3>
                                <div className="w-full mt-4 transition-opacity duration-300 delay-200 sm:block md:opacity-0 md:group-hover:opacity-100">
                                    <p className="text-light-slate text-sm">
                                        {activity.description}
                                    </p>
                                    <a href="/contact" className="text-bright-blue font-semibold mt-4 inline-block hover:underline">
                                        Learn More
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ActivitiesSection;