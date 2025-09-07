// src/api/routes/auth.routes.ts
import { Router } from 'express';
import { login, logout, getCurrentUser } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Endpoint ini publik
router.post('/login', login);

// Endpoint ini memerlukan pengguna untuk login terlebih dahulu
router.post('/logout', protect, logout);
router.get('/me', protect, getCurrentUser); // Untuk memeriksa status login

export default router;