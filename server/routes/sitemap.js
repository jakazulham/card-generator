export default function sitemapRoute(db) {
  return (_req, res) => {
    try {
      const BASE_URL = 'https://cetakkartu.com';

      // Fetch all published posts
      const posts = db.prepare(`
        SELECT slug, updated_at, published_at
        FROM posts
        WHERE status = 'published'
        ORDER BY published_at DESC
      `).all();

      // Fetch categories that have published posts
      const categories = db.prepare(`
        SELECT c.slug, c.created_at, COUNT(p.id) as post_count
        FROM categories c
        INNER JOIN posts p ON c.id = p.category_id AND p.status = 'published'
        GROUP BY c.id
        ORDER BY c.name ASC
      `).all();

      // Build XML
      const urls = [];

      // --- Static Pages ---
      urls.push({
        loc: `${BASE_URL}/`,
        lastmod: '2026-06-20',
        changefreq: 'weekly',
        priority: '1.0',
      });
      urls.push({
        loc: `${BASE_URL}/nisn`,
        lastmod: '2026-06-20',
        changefreq: 'weekly',
        priority: '0.9',
      });
      urls.push({
        loc: `${BASE_URL}/about`,
        lastmod: '2026-06-20',
        changefreq: 'monthly',
        priority: '0.7',
      });
      urls.push({
        loc: `${BASE_URL}/contact`,
        lastmod: '2026-06-20',
        changefreq: 'monthly',
        priority: '0.6',
      });
      urls.push({
        loc: `${BASE_URL}/disclaimer`,
        lastmod: '2026-06-20',
        changefreq: 'yearly',
        priority: '0.4',
      });

      // --- Blog Index ---
      urls.push({
        loc: `${BASE_URL}/blog`,
        lastmod: posts.length > 0
          ? posts[0].updated_at.slice(0, 10)
          : '2026-06-20',
        changefreq: 'daily',
        priority: '0.8',
      });

      // --- Blog Categories ---
      for (const cat of categories) {
        urls.push({
          loc: `${BASE_URL}/blog/kategori/${cat.slug}`,
          lastmod: cat.created_at
            ? cat.created_at.slice(0, 10)
            : '2026-06-20',
          changefreq: 'weekly',
          priority: '0.6',
        });
      }

      // --- Blog Posts ---
      for (const post of posts) {
        urls.push({
          loc: `${BASE_URL}/blog/${post.slug}`,
          lastmod: (post.updated_at || post.published_at).slice(0, 10),
          changefreq: 'monthly',
          priority: '0.7',
        });
      }

      // Render XML
      const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
        ...urls.map(u =>
          `  <url>\n` +
          `    <loc>${escapeXml(u.loc)}</loc>\n` +
          `    <lastmod>${u.lastmod}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n` +
          `    <priority>${u.priority}</priority>\n` +
          `  </url>`
        ),
        '</urlset>',
      ].join('\n');

      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.send(xml);
    } catch (err) {
      console.error('Sitemap generation error:', err);
      res.status(500).send('Internal Server Error');
    }
  };
}

function escapeXml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
