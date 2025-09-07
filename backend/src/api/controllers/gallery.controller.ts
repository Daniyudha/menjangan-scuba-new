// src/api/controllers/gallery.controller.ts
import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import fs from 'fs/promises'; // Untuk menghapus file
import path from 'path';

// --- IMAGES ---
export const getGalleryImages = async (req: Request, res: Response) => {
    try {
        const images = await prisma.galleryImage.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Error fetching gallery images." });
    }
};

export const uploadGalleryImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded." });
        }
        const { caption, category } = req.body;
        if (!caption || !category) {
            return res.status(400).json({ message: "Caption and category are required." });
        }

        const newImage = await prisma.galleryImage.create({
            data: {
                url: `/uploads/${req.file.filename}`,
                caption,
                category,
            }
        });
        
        res.status(201).json(newImage);
    } catch (error) {
        res.status(500).json({ message: "Error uploading image." });
    }
};

export const deleteGalleryImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        
        // 1. Temukan data gambar di database untuk mendapatkan path filenya
        const image = await prisma.galleryImage.findUnique({ where: { id } });

        if (!image) {
            return res.status(404).json({ message: 'Image not found.' });
        }

        // 2. Hapus file fisiknya dari folder /uploads
        const filePath = path.join(process.cwd(), 'uploads', path.basename(image.url));
        await fs.unlink(filePath).catch(err => console.warn(`Warn: Could not delete file ${filePath}:`, err)); // Jangan gagalkan jika file tidak ada

        // 3. Hapus record dari database
        await prisma.galleryImage.delete({ where: { id } });

        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Error deleting image." });
    }
};

// --- CATEGORIES ---
export const getGalleryCategories = async (req: Request, res: Response) => {
    try {
        const categories = await prisma.galleryCategory.findMany({
            orderBy: { name: 'asc' }
        });
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Error fetching categories." });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ message: "Category name is required." });
        }
        const newCategory = await prisma.galleryCategory.create({
            data: { name }
        });
        res.status(201).json(newCategory);
    } catch (error) {
        // Tangani error jika kategori sudah ada (karena 'name' bersifat unique)
        res.status(400).json({ message: "Error creating category. It may already exist." });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.galleryCategory.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: `Category not found.` });
    }
};

// --- CKEDITOR UPLOAD ---
// Fungsi ini tidak perlu 'async' atau interaksi database.
// Tugasnya hanya menerima file dan mengembalikan path-nya.
export const uploadCkeditorImage = (req: Request, res: Response) => {
    try {
        console.log('CKEditor upload request received');
        console.log('File details:', req.file);
        
        if (!req.file) {
            console.error('No file uploaded to CKEditor');
            return res.status(400).json({ error: { message: "No file uploaded" } });
        }
        
        // Check if file was successfully saved
        if (!req.file.filename) {
            console.error('File has no filename, multer may have failed');
            return res.status(500).json({ error: { message: "File processing failed" } });
        }
        
        const imageUrl = `/uploads/${req.file.filename}`;
        console.log('CKEditor upload successful, returning URL:', imageUrl);
        
        res.status(201).json({
            url: imageUrl,
        });
    } catch (error) {
        console.error('CKEditor upload error:', error);
        res.status(500).json({ error: { message: "Server error during upload: " + (error instanceof Error ? error.message : 'Unknown error') } });
    }
};