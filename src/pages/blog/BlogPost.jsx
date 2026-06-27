import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { usePost } from '../../hooks/usePosts';
import BlogCard from '../../components/blog/BlogCard';
import Breadcrumbs from '../../components/blog/Breadcrumbs';
import SocialShare from '../../components/blog/SocialShare';

function stripHtml(html) {
  const div = document.createElement('div');
  div.innerHTML = html;
  return div.textContent || div.innerText || '';
}

export default function BlogPost() {
  const { slug } = useParams();
  const { post, related, prevPost, nextPost, loading, error } = usePost(slug);

  // SEO meta tags
  useEffect(() => {
    if (!post) return;

    const pageTitle = `${post.title} - CetakKartu.com`;
    document.title = pageTitle;

    // Meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    const desc = post.excerpt || stripHtml(post.content).slice(0, 160);
    if (metaDesc) metaDesc.setAttribute('content', desc);

    // Open Graph
    setMeta('og:title', pageTitle);
    setMeta('og:description', desc);
    setMeta('og:type', 'article');
    setMeta('og:url', `https://cetakkartu.com/blog/${slug}`);
    if (post.featured_image) {
      setMeta('og:image', `https://cetakkartu.com${post.featured_image}`);
    }

    // Twitter Card
    setMeta('twitter:card', post.featured_image ? 'summary_large_image' : 'summary');
    setMeta('twitter:title', pageTitle);
    setMeta('twitter:description', desc);
    if (post.featured_image) {
      setMeta('twitter:image', `https://cetakkartu.com${post.featured_image}`);
    }

    // Canonical
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://cetakkartu.com/blog/${slug}`;

    return () => {
      ['og:title', 'og:description', 'og:type', 'og:url', 'og:image',
       'twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']
        .forEach(prop => {
          const el = document.querySelector(`meta[property="${prop}"]`);
          if (el) el.remove();
        });
    };
  }, [post, slug]);

  if (loading) {
    return (
      <div className="blog-post-page">
        <div className="blog-container">
          <div className="blog-post-loading">
            <div className="skeleton-line" style={{ width: '60%', height: '2rem' }} />
            <div className="skeleton-line" style={{ width: '40%', height: '1rem', marginTop: '1rem' }} />
            <div className="skeleton-image" style={{ height: '400px', marginTop: '2rem' }} />
            <div className="skeleton-line" style={{ width: '100%', marginTop: '2rem' }} />
            <div className="skeleton-line" style={{ width: '100%' }} />
            <div className="skeleton-line" style={{ width: '80%' }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="blog-post-page">
        <div className="blog-container">
          <div className="blog-error">
            <div className="blog-error-icon">🔍</div>
            <h3>Artikel tidak ditemukan</h3>
            <p>{error || 'Artikel yang Anda cari mungkin telah dihapus atau belum dipublikasikan.'}</p>
            <Link to="/blog" className="btn btn-primary">← Kembali ke Blog</Link>
          </div>
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'Beranda', to: '/' },
    { label: 'Blog', to: '/blog' },
  ];

  if (post.category_name) {
    breadcrumbItems.push({
      label: post.category_name,
      to: `/blog/kategori/${post.category_slug}`,
    });
  }

  breadcrumbItems.push({ label: post.title });

  // JSON-LD for Article
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt || stripHtml(post.content).slice(0, 160),
    image: post.featured_image ? `https://cetakkartu.com${post.featured_image}` : undefined,
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: {
      '@type': 'Organization',
      name: 'CetakKartu.com',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CetakKartu.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://cetakkartu.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://cetakkartu.com/blog/${post.slug}`,
    },
  };

  const postUrl = `https://cetakkartu.com/blog/${post.slug}`;

  return (
    <div className="blog-post-page">
      <div className="blog-container">
        <Breadcrumbs items={breadcrumbItems} />

        <article className="blog-post">
          {/* Header */}
          <header className="blog-post-header" style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 className="responsive-page-title">{post.title}</h1>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="blog-post-featured-image">
              <img src={post.featured_image} alt={post.title} />
            </div>
          )}

          {/* Content */}
          <div
            className="blog-post-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags Below Article */}
          {post.tags && post.tags.length > 0 && (
            <div className="blog-post-tags">
              {post.tags.map((tag, i) => (
                <span key={i} className="blog-post-tag">#{tag}</span>
              ))}
            </div>
          )}

          {/* Category Below Article */}
          {post.category_name && (
            <div className="blog-post-category-footer">
              <span className="blog-post-category-footer-label">Kategori:</span>
              <Link
                to={`/blog/kategori/${post.category_slug}`}
                className="blog-post-category-footer-link"
              >
                {post.category_name}
              </Link>
            </div>
          )}

          {/* Social Share Below Article */}
          <div className="blog-post-share-bottom">
            <SocialShare title={post.title} url={postUrl} />
          </div>

          {/* Previous / Next Navigation */}
          <nav className="blog-post-nav">
            {prevPost ? (
              <Link to={`/blog/${prevPost.slug}`} className="blog-post-nav-link prev">
                <span className="nav-label">← Artikel Sebelumnya</span>
                <span className="nav-title">{prevPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {nextPost ? (
              <Link to={`/blog/${nextPost.slug}`} className="blog-post-nav-link next">
                <span className="nav-label">Artikel Selanjutnya →</span>
                <span className="nav-title">{nextPost.title}</span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </article>

        {/* Related Posts */}
        {related.length > 0 && (
          <section className="blog-related">
            <h2 className="blog-related-title">Artikel Terkait</h2>
            <div className="blog-grid">
              {related.map(p => (
                <BlogCard key={p.id} post={p} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* JSON-LD Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(articleJsonLd)}
      </script>
    </div>
  );
}

// Helper to set meta tags
function setMeta(property, content) {
  if (!content) return;
  let el = document.querySelector(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
