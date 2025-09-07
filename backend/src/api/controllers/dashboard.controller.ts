// src/api/controllers/dashboard.controller.ts
import { Request, Response } from 'express';
import prisma from '../../config/prisma'; // Gunakan Prisma Client

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        // --- 1. Mengambil data agregat (jumlah) ---
        // Jalankan semua query hitungan secara bersamaan untuk efisiensi
        const [packageCount, articleCount, galleryImageCount, testimonialCount, settings] = await Promise.all([
            prisma.package.count(),
            prisma.article.count(),
            prisma.galleryImage.count(),
            prisma.testimonial.count(),
            prisma.setting.findUnique({ where: { id: "main_settings" } }) // Ambil juga data settings
        ]);

        // --- 2. Mengambil daftar data terbaru ---
        // Jalankan query ini juga secara bersamaan
        const [recentArticles, recentSubmissions] = await Promise.all([
            prisma.article.findMany({
                take: 5, // Ambil 5 teratas
                orderBy: { createdAt: 'desc' }, // Urutkan berdasarkan tanggal dibuat (terbaru)
                select: { id: true, title: true, date: true } // Hanya pilih kolom yang dibutuhkan
            }),
            prisma.submission.findMany({
                take: 5,
                orderBy: { date: 'desc' },
                select: { id: true, name: true, email: true, message: true }
            })
        ]);
        
        // --- 3. Gabungkan semua data menjadi satu objek respons ---
        const stats = {
            packageCount,
            articleCount,
            galleryImageCount,
            testimonialCount,
            heroHeadlines: settings?.hero || [], // Ambil dari data settings
            experienceMedia: settings?.experience || {}, // Ambil dari data settings
            recentArticles,
            recentSubmissions
        };

        res.status(200).json(stats);

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ message: "Failed to fetch dashboard stats." });
    }
};