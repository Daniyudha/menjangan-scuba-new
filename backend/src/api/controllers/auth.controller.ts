// src/api/controllers/auth.controller.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; // 1. Import bcrypt untuk membandingkan password
import prisma from '../../config/prisma'; // 2. Import Prisma Client
import { CookieOptions } from 'express';

// Fungsi generateToken tidak perlu diubah, sudah bagus
const generateToken = (res: Response, userId: string) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1d' });
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions: CookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        path: '/',
        domain: isProduction ? '.gegacreative.com' : undefined,
    };
    res.cookie('jwt', token, cookieOptions);
};


// --- LOGIN ---
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1d' });
            res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email } });
        } else {
            res.status(401).json({ message: "Invalid email or password" });
        }
    } catch (error) { res.status(500).json({ message: "Server error" }); }
};

// --- LOGOUT ---
export const logout = (req: Request, res: Response) => {
    res.status(200).json({ message: 'Logout handled by client' });
};

// --- (Opsional) Fungsi untuk mendapatkan data pengguna saat ini ---
// Berguna untuk memeriksa status login di frontend
export const getCurrentUser = async (req: Request, res: Response) => {
    // Middleware 'protect' sudah menempatkan data pengguna di req.user
    // Kita hanya perlu mengambilnya dari database untuk mendapatkan data terbaru
    if (req.user) {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: { // Hanya pilih data yang aman untuk dikirim
                id: true,
                email: true,
                name: true,
                role: true,
            }
        });

        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found." });
        }
    } else {
        res.status(401).json({ message: "Not authorized." });
    }
};