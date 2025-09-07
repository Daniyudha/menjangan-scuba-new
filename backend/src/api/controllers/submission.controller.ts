// src/api/controllers/submission.controller.ts
import { Request, Response } from 'express';
import prisma from '../../config/prisma';
import { Prisma } from '@prisma/client';

export const getSubmissions = async (req: Request, res: Response) => {
    try {
        const { search, page = 1, limit = 10, isRead } = req.query; // 1. Tambahkan 'isRead'
        
        const pageNum = parseInt(page as string, 10);
        const limitNum = parseInt(limit as string, 10);
        const skip = (pageNum - 1) * limitNum;

        // Buat kondisi pencarian
        const searchCondition: Prisma.SubmissionWhereInput = search ? {
            OR: [
                { name: { contains: search as string } },
                { email: { contains: search as string } },
                { message: { contains: search as string } },
            ]
        } : {};

        // Buat kondisi filter status
        const statusCondition: Prisma.SubmissionWhereInput = {};
        if (isRead === 'true') {
            statusCondition.isRead = true;
        } else if (isRead === 'false') {
            statusCondition.isRead = false;
        }

        // Gabungkan kedua kondisi
        const whereCondition: Prisma.SubmissionWhereInput = {
            AND: [searchCondition, statusCondition],
        };

        const [submissions, totalSubmissions] = await Promise.all([
            prisma.submission.findMany({ where: whereCondition, skip, take: limitNum, orderBy: { date: 'desc' } }),
            prisma.submission.count({ where: whereCondition })
        ]);

        res.status(200).json({
            data: submissions,
            pagination: {
                total: totalSubmissions,
                page: pageNum,
                limit: limitNum,
                totalPages: Math.ceil(totalSubmissions / limitNum),
            }
        });
    } catch (error) { res.status(500).json({ message: "Error fetching submissions." }); }
};

// --- CREATE ---
// Dari formulir kontak publik
export const createSubmission = async (req: Request, res: Response) => {
    try {
        const { name, email, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ message: "Name, email, and message are required." });
        }

        const newSubmission = await prisma.submission.create({
            data: {
                name,
                email,
                message,
                // 'date' sekarang akan dihandle oleh @default(now()) di skema Prisma,
                // tapi kita juga bisa menyediakannya secara manual jika perlu
                date: new Date().toISOString().split('T')[0],
            }
        });
        
        // Di aplikasi nyata, Anda bisa menambahkan logika pengiriman email notifikasi di sini
        
        res.status(201).json({ message: "Submission received successfully.", data: newSubmission });
    } catch (error) {
        console.error("Failed to create submission:", error);
        res.status(500).json({ message: "Error creating new submission." });
    }
};

// --- DELETE ---
// Dari panel admin
export const deleteSubmission = async (req: Request, res: Response) => {
    try {
        await prisma.submission.delete({
            where: { id: req.params.id }
        });
        res.status(204).send(); // Sukses, tidak ada konten
    } catch (error) {
        console.error(`Failed to delete submission with id ${req.params.id}:`, error);
        res.status(404).json({ message: `Submission with ID ${req.params.id} not found.` });
    }
};

// --- (Opsional) UPDATE untuk menandai sebagai "sudah dibaca" ---
export const markSubmissionAsRead = async (req: Request, res: Response) => {
    try {
        const { isRead } = req.body; // Harapannya menerima { isRead: boolean }
        
        const updatedSubmission = await prisma.submission.update({
            where: { id: req.params.id },
            data: { isRead: isRead },
        });

        res.status(200).json(updatedSubmission);
    } catch (error) {
        res.status(404).json({ message: `Submission with ID ${req.params.id} not found.` });
    }
};