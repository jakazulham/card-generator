import express from 'express';
import cors from 'cors';
import { existsSync, mkdirSync } from 'fs';
import config from './config.js';
import { initDatabase } from './db/init.js';
import authRoutes from './routes/auth.js';
import postRoutes from './routes/posts.js';
import adminRoutes from './routes/admin.js';
import uploadRoutes from './routes/upload.js';
import sitemapRoute from './routes/sitemap.js';

// Ensure data and upload directories exist
import { dirname } from 'path';
const dataDir = dirname(config.dbPath);
if (!existsSync(dataDir)) {
  mkdirSync(dataDir, { recursive: true });
}
if (!existsSync(config.uploadDir)) {
  mkdirSync(config.uploadDir, { recursive: true });
}

// Initialize database
const db = initDatabase();
console.log('Database initialized');

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve uploaded files
app.use('/uploads', express.static(config.uploadDir));

// Routes
app.use('/api/auth', authRoutes(db));
app.use('/api/posts', postRoutes(db));
app.use('/api/admin', adminRoutes(db));
app.use('/api/upload', uploadRoutes());
app.use('/api/categories', (req, res) => {
  // GET /api/categories — public, list categories with post counts
  const categories = db.prepare(`
    SELECT c.*, COUNT(p.id) as post_count
    FROM categories c
    LEFT JOIN posts p ON c.id = p.category_id AND p.status = 'published'
    GROUP BY c.id
    ORDER BY c.name ASC
  `).all();
  res.json({ data: categories });
});

// Sitemap
app.get('/sitemap.xml', sitemapRoute(db));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Terjadi kesalahan server.' });
});

app.listen(config.port, () => {
  console.log(`Blog API running on http://localhost:${config.port}`);
  console.log(`Admin login: ${config.adminUsername} / ${config.adminPassword}`);
});
