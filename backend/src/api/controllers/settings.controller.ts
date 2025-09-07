// src/api/controllers/settings.controller.ts
import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

const SETTINGS_ID = "main_settings";

// --- GET ---
export const getSettings = async (req: Request, res: Response) => {
    try {
        let settings = await prisma.setting.findUnique({
            where: { id: SETTINGS_ID }
        });
        
        // Jika settings belum ada di DB, buat entri default
        if (!settings) {
            settings = await prisma.setting.create({
                data: {
                    id: SETTINGS_ID,
                    hero: [],
                    experience: { videoUrl: '', imageUrl: '' },
                    socialLinks: { instagram: '', facebook: '', twitter: '', youtube: '' }
                }
            });
        }

        // Kirim data yang sudah digabungkan dan bersih
        res.status(200).json({
            hero: settings.hero,
            experience: settings.experience,
            socialLinks: settings.socialLinks
        });

    } catch (error) {
        console.error("Failed to fetch settings:", error);
        res.status(500).json({ message: "Error fetching settings from database." });
    }
};

// --- UPDATE HERO ---
export const updateHeroSettings = async (req: Request, res: Response) => {
    try {
        const newHeroData = req.body;
        if (!Array.isArray(newHeroData)) {
            return res.status(400).json({ message: 'Invalid data format.' });
        }
        const updatedSettings = await prisma.setting.update({
            where: { id: SETTINGS_ID },
            data: { hero: newHeroData as unknown as Prisma.JsonArray },
        });
        res.status(200).json({ message: 'Hero settings updated.', data: updatedSettings.hero });
    } catch (error) {
        res.status(500).json({ message: "Error updating hero settings." });
    }
};

// --- UPLOAD GAMBAR HERO (FUNGSI BARU) ---
export const uploadHeroImage = (req: Request, res: Response) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded.' });
    }
    // Kembalikan path file yang bisa diakses publik
    res.status(201).json({
        message: 'File uploaded successfully!',
        imageUrl: `/uploads/${req.file.filename}`
    });
};

// --- UPDATE EXPERIENCE ---
export const updateExperienceSettings = async (req: Request, res: Response) => {
    try {
        const { videoUrl } = req.body;
        
        // Ambil data lama dulu untuk digabungkan
        const currentSettings = await prisma.setting.findUnique({ where: { id: SETTINGS_ID } });
        if (!currentSettings) return res.status(404).json({ message: 'Settings not found.' });
        
        const currentExperience = (currentSettings.experience as Prisma.JsonObject) || {};

        const dataToUpdate = {
            videoUrl: videoUrl || currentExperience.videoUrl,
            // Jika ada file baru, gunakan path-nya. Jika tidak, pertahankan path yang lama.
            imageUrl: req.file ? `/uploads/${req.file.filename}` : currentExperience.imageUrl,
        };
        
        const updatedSettings = await prisma.setting.update({
            where: { id: SETTINGS_ID },
            data: {
                experience: dataToUpdate as unknown as Prisma.JsonObject,
            }
        });

        res.status(200).json({ message: 'Experience settings updated.', data: updatedSettings.experience });
    } catch (error) {
        console.error("Failed to update experience settings:", error);
        res.status(500).json({ message: "Error updating experience settings." });
    }
};

// --- UPDATE SOCIAL LINKS ---
export const updateSocialLinks = async (req: Request, res: Response) => {
    try {
        const newSocialLinks = req.body;
        
        const updatedSettings = await prisma.setting.update({
            where: { id: SETTINGS_ID },
            data: {
                socialLinks: newSocialLinks as unknown as Prisma.JsonObject,
            }
        });

        res.status(200).json({ message: 'Social links updated.', data: updatedSettings.socialLinks });
    } catch (error) {
        console.error("Failed to update social links:", error);
        res.status(500).json({ message: "Error updating social links." });
    }
};