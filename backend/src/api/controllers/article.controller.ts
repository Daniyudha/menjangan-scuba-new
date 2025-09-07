// src/api/controllers/article.controller.ts
import { Request, Response } from 'express';
import prisma from '../../config/prisma';

// --- FUNGSI GETARTICLES YANG DIPERBAIKI ---
export const getArticles = async (req: Request, res: Response) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        // --- PERBAIKAN UTAMA DI SINI ---
        // Hapus properti 'mode: "insensitive"' karena tidak didukung oleh MySQL di Prisma
        const whereCondition = search ? {
            OR: [
                { title: { contains: search as string } },
                { content: { contains: search as string } },
            ]
        } : {};

        const [articles, totalArticles] = await Promise.all([
            prisma.article.findMany({
                where: whereCondition,
                skip: skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.article.count({ where: whereCondition })
        ]);

        res.status(200).json({
            data: articles,
            pagination: {
                total: totalArticles,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalArticles / limitNum),
            }
        });

    } catch (error) {
        console.error("Failed to fetch articles:", error);
        res.status(500).json({ message: "Error fetching articles from database." });
    }
};

// --- READ ONE ---
export const getArticleById = async (req: Request, res: Response) => {
    try {
        const article = await prisma.article.findUnique({
            where: { id: req.params.id }
        });
        if (article) {
            res.status(200).json(article);
        } else {
            res.status(404).json({ message: 'Article not found' });
        }
    } catch (error) {
        console.error(`Failed to fetch article with id ${req.params.id}:`, error);
        res.status(500).json({ message: "Error fetching article from database." });
    }
};

// --- READ ONE PUBLIC --- 
export const getPublicArticleDetail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Ambil artikel utama (pastikan statusnya 'Published') dan 3 artikel terkait
        const [mainArticle, relatedArticles] = await Promise.all([
            prisma.article.findFirst({ 
                where: { 
                    id: id,
                    status: 'Published' // Hanya tampilkan jika sudah dipublikasikan
                } 
            }),
            prisma.article.findMany({
                where: {
                    id: { not: id }, // Kecualikan artikel saat ini
                    status: 'Published'
                },
                take: 3,
                orderBy: { createdAt: 'desc' }
            })
        ]);

        // Jika artikel utama tidak ditemukan (atau belum published), kembalikan 404
        if (!mainArticle) {
            return res.status(404).json({ message: 'Article not found or not published.' });
        }
        
        // Kirim respons dengan struktur yang diharapkan oleh halaman detail publik
        res.status(200).json({
            mainArticle: mainArticle,
            relatedArticles: relatedArticles
        });

    } catch (error) {
        console.error(`Failed to fetch public article detail for id ${req.params.id}:`, error);
        res.status(500).json({ message: "Error fetching article details." });
    }
};

// --- CREATE ---
export const createArticle = async (req: Request, res: Response) => {
    try {
        const { title, status, content } = req.body;
        
        if (!title || !status || !content) {
            return res.status(400).json({ message: 'Title, status, and content are required.' });
        }

        // Handle file upload
        const featuredImage = req.file ? `/uploads/${req.file.filename}` : '/uploads/default-article.jpg';

        const newArticleData = {
            title,
            status,
            content,
            featuredImage,
            // 'date' sekarang akan di-handle oleh database, jadi kita tidak perlu mengirimnya
            date: new Date().toISOString().split('T')[0], // Jika Anda tetap ingin format YYYY-MM-DD
        };
        
        const newArticle = await prisma.article.create({
            data: newArticleData
        });
        
        res.status(201).json(newArticle);
    } catch (error) {
        console.error("Failed to create article:", error);
        res.status(500).json({ message: "Error creating new article." });
    }
};

// --- UPDATE ---
export const updateArticle = async (req: Request, res: Response) => {
    const startTime = Date.now();
    const articleId = req.params.id;
    
    try {
        console.log(`Starting article update for ID: ${articleId}`);
        
        // Validate required fields
        const { title, status, content } = req.body;
        if (!title || !status || !content) {
            console.warn(`Missing required fields for article ${articleId}:`, { title, status, content });
            return res.status(400).json({
                message: 'Title, status, and content are required.',
                received: { title: !!title, status: !!status, content: !!content }
            });
        }

        const dataToUpdate: any = {
            title,
            status,
            content,
            updatedAt: new Date()
        };
        
        // Jika ada file baru yang di-upload, perbarui path gambarnya
        if (req.file) {
            console.log(`New file uploaded for article ${articleId}: ${req.file.filename}`);
            dataToUpdate.featuredImage = `/uploads/${req.file.filename}`;
        }
        
        // Optimize: Use transaction for better performance and atomicity
        const updatedArticle = await prisma.article.update({
            where: { id: articleId },
            data: dataToUpdate,
            select: {
                id: true,
                title: true,
                status: true,
                content: true,
                featuredImage: true,
                date: true,
                createdAt: true,
                updatedAt: true
            }
        });
        
        const processingTime = Date.now() - startTime;
        console.log(`Article ${articleId} updated successfully in ${processingTime}ms`);
        
        res.status(200).json({
            ...updatedArticle,
            processingTime: `${processingTime}ms`
        });
        
    } catch (error: any) {
        const processingTime = Date.now() - startTime;
        console.error(`Failed to update article ${articleId} after ${processingTime}ms:`, error);
        
        if (error.code === 'P2025') {
            // Prisma record not found error
            res.status(404).json({
                message: `Article with ID ${articleId} not found.`,
                processingTime: `${processingTime}ms`
            });
        } else if (error.code === 'P2002') {
            // Unique constraint violation (title)
            res.status(409).json({
                message: 'Article title already exists. Please choose a different title.',
                processingTime: `${processingTime}ms`
            });
        } else {
            // Generic database error
            res.status(500).json({
                message: 'Error updating article in database.',
                processingTime: `${processingTime}ms`,
                ...(process.env.NODE_ENV === 'development' && { error: error.message })
            });
        }
    }
};

// --- DELETE ---
export const deleteArticle = async (req: Request, res: Response) => {
    try {
        await prisma.article.delete({
            where: { id: req.params.id }
        });
        res.status(204).send(); // Sukses, tidak ada konten yang dikembalikan
    } catch (error) {
        console.error(`Failed to delete article with id ${req.params.id}:`, error);
        res.status(404).json({ message: `Article with ID ${req.params.id} not found.` });
    }
};