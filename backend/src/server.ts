// src/server.ts
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

// Import semua routes Anda
import articleRoutes from './api/routes/article.routes';
import authRoutes from './api/routes/auth.routes';
import dashboardRoutes from './api/routes/dashboard.routes';
import galleryRoutes from './api/routes/gallery.routes';
import packageRoutes from './api/routes/package.routes';
import settingsRoutes from './api/routes/settings.routes';
import submissionRoutes from './api/routes/submission.routes';
import testimonialRoutes from './api/routes/testimonial.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// --- PERBAIKAN CORS UNTUK TOOLS SEPERTI POSTMAN/CURL ---
// Konfigurasi CORS yang lebih fleksibel
const allowedOrigins = [
    'http://192.168.1.106:3000',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3003',
    'https://menjangan.gegacreative.com',
    'https://www.menjangan.gegacreative.com',
    'https://menjanganscuba.com',
    'https://www.menjanganscuba.com'
];

// CORS configuration yang menerima requests dari tools tanpa origin
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Middleware untuk parsing cookies
app.use(cookieParser());

// Middleware untuk parsing JSON dan form data
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
    res.send('Menjangan Scuba Backend is running!');
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', err);
    
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ message: 'File too large' });
    }
    
    res.status(err.status || 500).json({
        message: err.message || 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});