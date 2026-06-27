import { Router } from 'express';

export default function postRoutes(db) {
  const router = Router();

  // GET /api/posts — list published posts (paginated, optional category filter)
  router.get('/', (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
    const offset = (page - 1) * limit;
    const category = req.query.category || null;

    let countSql = 'SELECT COUNT(*) as total FROM posts WHERE status = ?';
    let dataSql = `
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.status = ?
    `;
    const params = ['published'];

    if (category) {
      const cat = db.prepare('SELECT id FROM categories WHERE slug = ?').get(category);
      if (cat) {
        countSql += ' AND category_id = ?';
        dataSql += ' AND p.category_id = ?';
        params.push(cat.id);
      }
    }

    const { total } = db.prepare(countSql).get(...params);
    const totalPages = Math.ceil(total / limit);

    dataSql += ' ORDER BY p.published_at DESC LIMIT ? OFFSET ?';
    const posts = db.prepare(dataSql).all(...params, limit, offset);

    // Parse tags from JSON string
    const parsed = posts.map(p => ({
      ...p,
      tags: JSON.parse(p.tags || '[]'),
    }));

    res.json({
      data: parsed,
      pagination: { page, limit, total, totalPages },
    });
  });

  // GET /api/posts/:slug — single published post
  router.get('/:slug', (req, res) => {
    const post = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.slug = ? AND p.status = 'published'
    `).get(req.params.slug);

    if (!post) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    post.tags = JSON.parse(post.tags || '[]');

    // Get related posts (same category, exclude current)
    let related = [];
    if (post.category_id) {
      related = db.prepare(`
        SELECT p.id, p.title, p.slug, p.featured_image, p.published_at, p.category_id,
               c.name as category_name, c.slug as category_slug
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.category_id = ? AND p.id != ? AND p.status = 'published'
        ORDER BY p.published_at DESC
        LIMIT 3
      `).all(post.category_id, post.id);
    }

    // If not enough related, get latest posts
    if (related.length < 3) {
      const existingIds = [post.id, ...related.map(r => r.id)];
      const placeholders = existingIds.map(() => '?').join(',');
      const more = db.prepare(`
        SELECT p.id, p.title, p.slug, p.featured_image, p.published_at, p.category_id,
               c.name as category_name, c.slug as category_slug
        FROM posts p
        LEFT JOIN categories c ON p.category_id = c.id
        WHERE p.id NOT IN (${placeholders}) AND p.status = 'published'
        ORDER BY p.published_at DESC
        LIMIT ?
      `).all(...existingIds, 3 - related.length);
      related = [...related, ...more];
    }

    // Get previous and next posts
    const prev = db.prepare(`
      SELECT title, slug FROM posts
      WHERE published_at < ? AND status = 'published' AND id != ?
      ORDER BY published_at DESC LIMIT 1
    `).get(post.published_at, post.id);

    const next = db.prepare(`
      SELECT title, slug FROM posts
      WHERE published_at > ? AND status = 'published' AND id != ?
      ORDER BY published_at ASC LIMIT 1
    `).get(post.published_at, post.id);

    res.json({
      data: post,
      related,
      prev: prev || null,
      next: next || null,
    });
  });

  return router;
}
