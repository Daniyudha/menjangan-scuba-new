// prisma/seed.ts

/// <reference types="node" /> 

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs'; // Impor untuk hashing password
import { db as mockDb } from '../src/data/db'; // Impor data mockup Anda

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // 1. Hapus semua data lama untuk memastikan database bersih
  await prisma.user.deleteMany({});
  await prisma.setting.deleteMany({});
  await prisma.submission.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.galleryImage.deleteMany({});
  await prisma.galleryCategory.deleteMany({});
  await prisma.article.deleteMany({});
  await prisma.package.deleteMany({});
  console.log('Old data deleted successfully.');

  // 2. Seed Pengguna Admin
  const hashedPassword = await bcrypt.hash('password123', 10); // Enkripsi password
  await prisma.user.create({
    data: {
      email: 'admin@menjanganscuba.com',
      name: 'Admin Scuba',
      password: hashedPassword,
      role: 'ADMIN',
    },
  });
  console.log('Admin user created.');

  // 3. Seed Packages
  for (const pkg of mockDb.packages) {
    await prisma.package.create({ 
      data: {
        ...pkg,
        // Konversi array ke tipe Json yang diharapkan Prisma
        inclusions: pkg.inclusions as any,
      } 
    });
  }
  console.log('Packages seeded.');

  // 4. Seed Articles
  for (const article of mockDb.articles) {
    await prisma.article.create({ data: article });
  }
  console.log('Articles seeded.');

  // 5. Seed Gallery Categories
  for (const cat of mockDb.galleryCategories) {
    await prisma.galleryCategory.create({ data: cat });
  }
  console.log('Gallery categories seeded.');

  // 6. Seed Gallery Images
  for (const img of mockDb.galleryImages) {
    await prisma.galleryImage.create({ data: img });
  }
  console.log('Gallery images seeded.');

  // 7. Seed Testimonials
  for (const testimonial of mockDb.testimonials) {
    await prisma.testimonial.create({ data: testimonial });
  }
  console.log('Testimonials seeded.');

  // 8. Seed Submissions
  for (const submission of mockDb.submissions) {
    await prisma.submission.create({ data: submission });
  }
  console.log('Submissions seeded.');
  
  // 9. Seed Settings
  await prisma.setting.create({
    data: {
      id: 'main_settings', // ID tetap agar kita selalu bisa menemukannya
      // Konversi objek/array ke tipe Json yang diharapkan Prisma
      hero: mockDb.settings.hero as any,
      experience: mockDb.settings.experience as any,
      socialLinks: mockDb.settings.socialLinks as any,
    },
  });
  console.log('Settings seeded.');

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error("An error occurred during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Prisma client disconnected.');
  });