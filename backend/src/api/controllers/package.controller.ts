// src/api/controllers/package.controller.ts
import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

// --- READ ALL ---
export const getPackages = async (req: Request, res: Response) => {
    try {
        const packages = await prisma.package.findMany({ orderBy: { createdAt: 'asc' } });
        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching packages." });
    }
};

// --- READ ONE ---
export const getPackageById = async (req: Request, res: Response) => {
    try {
        const pkg = await prisma.package.findUnique({ where: { id: req.params.id } });
        if (pkg) res.status(200).json(pkg);
        else res.status(404).json({ message: 'Package not found' });
    } catch (error) {
        res.status(500).json({ message: "Error fetching package." });
    }
};

// --- CREATE ---
export const createPackage = async (req: Request, res: Response) => {
    try {
        // Data teks dari FormData akan ada di req.body
        const { title, price, description, inclusions } = req.body;
        
        if (!title || !price) {
            return res.status(400).json({ message: 'Title and price are required.' });
        }
        
        const newPackage = await prisma.package.create({
            data: {
                title,
                price,
                description: description || '',
                // Inclusions diubah dari string kembali ke array
                inclusions: inclusions ? inclusions.split('\n').filter((line: string) => line.trim() !== '') : [],
                // Path gambar dari file yang di-upload oleh multer
                imageUrl: req.file ? `/uploads/${req.file.filename}` : null,
            }
        });
        
        res.status(201).json(newPackage);
    } catch (error) {
        console.error("Failed to create package:", error);
        res.status(500).json({ message: "Error creating new package." });
    }
};

// --- UPDATE ---
export const updatePackage = async (req: Request, res: Response) => {
    try {
        const { title, price, description, inclusions } = req.body;
        
        // Objek untuk menampung data yang akan diupdate
        const dataToUpdate: any = {};

        // Tambahkan data teks jika ada
        if (title) dataToUpdate.title = title;
        if (price) dataToUpdate.price = price;
        if (description) dataToUpdate.description = description;
        if (inclusions) {
            dataToUpdate.inclusions = inclusions.split('\n').filter((line: string) => line.trim() !== '');
        }
        
        // Cek jika ada file baru yang di-upload
        if (req.file) {
            dataToUpdate.imageUrl = `/uploads/${req.file.filename}`;
        }
        
        const updatedPackage = await prisma.package.update({
            where: { id: req.params.id },
            data: dataToUpdate,
        });
        res.status(200).json(updatedPackage);
    } catch (error) {
        console.error(`Failed to update package with id ${req.params.id}:`, error);
        res.status(404).json({ message: `Package with ID ${req.params.id} not found.` });
    }
};

// --- DELETE ---
export const deletePackage = async (req: Request, res: Response) => {
    try {
        // Di aplikasi nyata, Anda juga ingin menghapus file gambar terkait dari server
        await prisma.package.delete({ where: { id: req.params.id } });
        res.status(204).send();
    } catch (error) {
        res.status(404).json({ message: `Package with ID ${req.params.id} not found.` });
    }
};