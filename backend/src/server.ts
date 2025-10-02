// src/server.ts
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import path from 'path';

// Import semua routes
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

/* =========================
   CORS CONFIG
========================= */
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

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow Postman, curl, mobile apps
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);

/* =========================
   MIDDLEWARE
========================= */
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

/* =========================
   STATIC FILE SERVING
========================= */
// Gunakan process.cwd() agar path selalu benar walaupun sudah di-build
const uploadsPath = path.join(process.cwd(), 'uploads');

// akses langsung: /uploads/filename.jpg
app.use(
  '/uploads',
  express.static(uploadsPath, {
    maxAge: '1d',
    etag: true,
    lastModified: true,
    setHeaders: (res) => {
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Methods', 'GET');
    },
  })
);

// alias biar /api/uploads/... juga bisa
app.use('/api/uploads', express.static(uploadsPath));

/* =========================
   API ROUTES
========================= */
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/dashboard', dashboardRoutes);

/* =========================
   HEALTH CHECK & ROOT
========================= */
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.send('Menjangan Scuba Backend is running!');
});

/* =========================
   GLOBAL ERROR HANDLER
========================= */
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Global error handler:', err);

    if (err.type === 'entity.too.large') {
      return res.status(413).json({ message: 'File too large' });
    }

    res.status(err.status || 500).json({
      message: err.message || 'Internal server error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }
);

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
  console.log(`✅ Server is listening on port ${PORT}`);
  console.log(`✅ Health check: http://localhost:${PORT}/health`);
  console.log(`✅ Static uploads: http://localhost:${PORT}/uploads/<filename>`);
});
