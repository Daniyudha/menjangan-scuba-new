// src/api/routes/settings.routes.ts
import { Router } from "express";
import {
  getSettings,
  updateHeroSettings,
  uploadHeroImage,
  updateExperienceSettings,
  updateSocialLinks,
  // Kita tidak lagi memerlukan fungsi upload terpisah di sini
  // karena sudah digabungkan ke dalam fungsi 'update'
} from "../controllers/settings.controller";
import { protect } from '../middleware/auth.middleware';
import { upload } from '../../config/multer.config';

const router = Router();

// --- RUTE-RUTE UNTUK SETTINGS ---

// Endpoint GET: Mengambil semua data settings (bisa jadi publik atau dilindungi)
router.get("/", getSettings);


// Endpoint PUT: Memperbarui bagian HERO
// Menggunakan upload.any() karena form Hero bisa mengirim banyak file gambar (satu per slide)
router.put("/hero", protect, upload.any(), updateHeroSettings);
router.post("/hero/image", protect, upload.single('heroImage'), uploadHeroImage);


// Endpoint PUT: Memperbarui bagian EXPERIENCE
// Menggunakan upload.single('experienceImage') karena form Experience hanya mengirim satu file
router.put("/experience", protect, upload.single('experienceImage'), updateExperienceSettings);


// Endpoint PUT: Memperbarui bagian SOCIAL LINKS
// Tidak memerlukan multer karena hanya mengirim data teks
router.put("/social", protect, updateSocialLinks);


export default router;