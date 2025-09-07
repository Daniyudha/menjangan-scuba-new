// src/api/controllers/testimonial.controller.ts
import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client'; 

// --- FUNGSI GETTESTIMONIALS YANG DIPERBARUI ---
export const getTestimonials = async (req: Request, res: Response) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        const whereCondition: Prisma.TestimonialWhereInput = search ? {
            OR: [
                { name: { contains: search as string } },
                { quote: { contains: search as string } },
            ]
        } : {};

        const [testimonials, totalTestimonials] = await Promise.all([
            prisma.testimonial.findMany({
                where: whereCondition,
                skip: skip,
                take: limitNum,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.testimonial.count({ where: whereCondition })
        ]);

        res.status(200).json({
            data: testimonials,
            pagination: {
                total: totalTestimonials,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalTestimonials / limitNum),
            }
        });

    } catch (error) {
        console.error("Failed to fetch testimonials:", error);
        res.status(500).json({ message: "Error fetching testimonials." });
    }
};

// --- FUNGSI LAINNYA (TIDAK BERUBAH) ---
export const createTestimonial = async (req: Request, res: Response) => {
    try {
        const { name, quote, origin } = req.body;
        if (!name || !quote) {
            return res.status(400).json({ message: 'Name and quote are required.' });
        }
        
        // Cek apakah ada file yang di-upload. Jika tidak, gunakan default.
        const avatarUrl = req.file 
            ? `/uploads/${req.file.filename}` 
            : '/uploads/avatar-default.png'; // Pastikan file ini ada

        const newTestimonial = await prisma.testimonial.create({
            data: { 
                name, 
                quote, 
                origin,
                avatarUrl,
                isFeatured: false // Testimoni baru tidak langsung diunggulkan
            }
        });
        
        res.status(201).json(newTestimonial);
    } catch (error) {
        console.error("Failed to create testimonial:", error);
        res.status(500).json({ message: "Error creating new testimonial." });
    }
};

export const deleteTestimonial = async (req: Request, res: Response) => {
    try {
        await prisma.testimonial.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: `Testimonial with ID ${req.params.id} not found.` });
    }
};

export const updateTestimonialFeaturedStatus = async (req: Request, res: Response) => {
    try {
        console.log(`PATCH /testimonials/${req.params.id}/featured received`, {
            body: req.body,
            headers: req.headers,
            params: req.params
        });

        const { isFeatured } = req.body;
        if (typeof isFeatured !== 'boolean') {
            return res.status(400).json({ message: 'isFeatured must be a boolean.' });
        }
        
        const updatedTestimonial = await prisma.testimonial.update({
            where: { id: req.params.id },
            data: { isFeatured: isFeatured },
        });

        console.log(`Testimonial ${req.params.id} updated to featured: ${isFeatured}`);
        res.status(200).json(updatedTestimonial);
    } catch (error) {
        console.error(`Error updating testimonial ${req.params.id}:`, error);
        res.status(404).json({ message: `Testimonial with ID ${req.params.id} not found.` });
    }
};