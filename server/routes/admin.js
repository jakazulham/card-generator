import { Router } from 'express';
import slugify from 'slugify';
import { authMiddleware } from '../middleware/auth.js';

export default function adminRoutes(db) {
  const router = Router();

  // All admin routes require authentication
  router.use(authMiddleware);

  // ─── POSTS ────────────────────────────────────────────

  // GET /api/admin/posts — list all posts
  router.get('/posts', (req, res) => {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const offset = (page - 1) * limit;

    let countSql = 'SELECT COUNT(*) as total FROM posts p';
    let dataSql = `
      SELECT p.*, c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const params = [];
    const conditions = [];

    if (req.query.status && req.query.status !== 'all') {
      conditions.push('p.status = ?');
      params.push(req.query.status);
    }

    if (req.query.search) {
      conditions.push('(p.title LIKE ? OR p.excerpt LIKE ?)');
      const search = `%${req.query.search}%`;
      params.push(search, search);
    }

    if (conditions.length) {
      const where = ' WHERE ' + conditions.join(' AND ');
      countSql += where;
      dataSql += where;
    }

    const { total } = db.prepare(countSql).get(...params);
    const totalPages = Math.ceil(total / limit);

    dataSql += ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?';
    const posts = db.prepare(dataSql).all(...params, limit, offset);

    const parsed = posts.map(p => ({
      ...p,
      tags: JSON.parse(p.tags || '[]'),
    }));

    res.json({
      data: parsed,
      pagination: { page, limit, total, totalPages },
    });
  });

  // GET /api/admin/posts/:id — single post by id
  router.get('/posts/:id', (req, res) => {
    const post = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    post.tags = JSON.parse(post.tags || '[]');
    res.json({ data: post });
  });

  // POST /api/admin/posts — create post
  router.post('/posts', (req, res) => {
    const {
      title, slug, content, excerpt, featured_image,
      category_id, tags, status, published_at
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Judul artikel wajib diisi.' });
    }

    // Generate slug from title if not provided
    let finalSlug = slug || slugify(title, {
      lower: true,
      strict: true,
      locale: 'id',
    });

    // Ensure unique slug
    let existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(finalSlug);
    let counter = 1;
    while (existing) {
      finalSlug = (slug || slugify(title, { lower: true, strict: true, locale: 'id' })) + '-' + counter;
      existing = db.prepare('SELECT id FROM posts WHERE slug = ?').get(finalSlug);
      counter++;
    }

    const pubDate = status === 'published'
      ? (published_at || new Date().toISOString())
      : (status === 'scheduled' ? published_at : null);

    const result = db.prepare(`
      INSERT INTO posts (title, slug, content, excerpt, featured_image, category_id, tags, status, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      title,
      finalSlug,
      content || '',
      excerpt || '',
      featured_image || '',
      category_id || null,
      JSON.stringify(tags || []),
      status || 'draft',
      pubDate
    );

    const post = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(result.lastInsertRowid);

    post.tags = JSON.parse(post.tags || '[]');
    res.status(201).json({ data: post });
  });

  // PUT /api/admin/posts/:id — update post
  router.put('/posts/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    const {
      title, slug, content, excerpt, featured_image,
      category_id, tags, status, published_at
    } = req.body;

    // Generate slug if title changed
    let finalSlug = slug || existing.slug;
    if (slug || (title && title !== existing.title)) {
      finalSlug = slug || slugify((title || existing.title), {
        lower: true,
        strict: true,
        locale: 'id',
      });

      // Ensure unique slug (exclude current post)
      let conflict = db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').get(finalSlug, req.params.id);
      let counter = 1;
      while (conflict) {
        finalSlug = (slug || slugify((title || existing.title), {
          lower: true, strict: true, locale: 'id',
        })) + '-' + counter;
        conflict = db.prepare('SELECT id FROM posts WHERE slug = ? AND id != ?').get(finalSlug, req.params.id);
        counter++;
      }
    }

    const pubDate = status === 'published'
      ? (published_at || existing.published_at || new Date().toISOString())
      : (status === 'scheduled' ? published_at : null);

    db.prepare(`
      UPDATE posts SET
        title = ?, slug = ?, content = ?, excerpt = ?, featured_image = ?,
        category_id = ?, tags = ?, status = ?, published_at = ?,
        updated_at = datetime('now')
      WHERE id = ?
    `).run(
      title || existing.title,
      finalSlug,
      content !== undefined ? content : existing.content,
      excerpt !== undefined ? excerpt : existing.excerpt,
      featured_image !== undefined ? featured_image : existing.featured_image,
      category_id !== undefined ? category_id : existing.category_id,
      tags !== undefined ? JSON.stringify(tags) : existing.tags,
      status || existing.status,
      pubDate,
      req.params.id
    );

    const post = db.prepare(`
      SELECT p.*, c.name as category_name
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = ?
    `).get(req.params.id);

    post.tags = JSON.parse(post.tags || '[]');
    res.json({ data: post });
  });

  // DELETE /api/admin/posts/:id
  router.delete('/posts/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM posts WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Artikel tidak ditemukan.' });
    }

    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
    res.json({ message: 'Artikel berhasil dihapus.' });
  });

  // ─── CATEGORIES ───────────────────────────────────────

  // GET /api/admin/categories
  router.get('/categories', (req, res) => {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();
    res.json({ data: categories });
  });

  // POST /api/admin/categories
  router.post('/categories', (req, res) => {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Nama kategori wajib diisi.' });
    }

    let catSlug = slugify(name, { lower: true, strict: true, locale: 'id' });

    let existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(catSlug);
    let counter = 1;
    while (existing) {
      catSlug = slugify(name, { lower: true, strict: true, locale: 'id' }) + '-' + counter;
      existing = db.prepare('SELECT id FROM categories WHERE slug = ?').get(catSlug);
      counter++;
    }

    const result = db.prepare('INSERT INTO categories (name, slug, description) VALUES (?, ?, ?)').run(
      name, catSlug, description || ''
    );

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ data: { ...category, post_count: 0 } });
  });

  // PUT /api/admin/categories/:id
  router.put('/categories/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
    }

    const { name, description } = req.body;

    let catSlug = slugify((name || existing.name), { lower: true, strict: true, locale: 'id' });

    if (catSlug !== existing.slug) {
      let conflict = db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').get(catSlug, req.params.id);
      let counter = 1;
      while (conflict) {
        catSlug = slugify((name || existing.name), { lower: true, strict: true, locale: 'id' }) + '-' + counter;
        conflict = db.prepare('SELECT id FROM categories WHERE slug = ? AND id != ?').get(catSlug, req.params.id);
        counter++;
      }
    }

    db.prepare('UPDATE categories SET name = ?, slug = ?, description = ? WHERE id = ?').run(
      name || existing.name,
      catSlug,
      description !== undefined ? description : existing.description,
      req.params.id
    );

    const category = db.prepare(`
      SELECT c.*, COUNT(p.id) as post_count
      FROM categories c
      LEFT JOIN posts p ON c.id = p.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `).get(req.params.id);

    res.json({ data: category });
  });

  // DELETE /api/admin/categories/:id
  router.delete('/categories/:id', (req, res) => {
    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(req.params.id);
    if (!existing) {
      return res.status(404).json({ error: 'Kategori tidak ditemukan.' });
    }

    // Set posts in this category to null
    db.prepare('UPDATE posts SET category_id = NULL WHERE category_id = ?').run(req.params.id);
    db.prepare('DELETE FROM categories WHERE id = ?').run(req.params.id);

    res.json({ message: 'Kategori berhasil dihapus.' });
  });

  return router;
}
