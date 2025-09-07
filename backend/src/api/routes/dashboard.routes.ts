// src/api/routes/dashboard.routes.ts
import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.get('/', getDashboardStats);
export default router;