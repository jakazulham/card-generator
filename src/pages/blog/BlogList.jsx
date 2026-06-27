import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { usePostsList } from '../../hooks/usePosts';
import { useCategories } from '../../hooks/useCategories';
import BlogCard from '../../components/blog/BlogCard';
import Pagination from '../../components/blog/Pagination';
import Breadcrumbs from '../../components/blog/Breadcrumbs';

export default function BlogList() {
  const { categorySlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1');

  const { data: posts, pagination, loading, error } = usePostsList(page, categorySlug || null);
  const { data: categories } = useCategories();

  // SEO title
  useEffect(() => {
    const cat = categories.find(c => c.slug === categorySlug);
    const title = cat
      ? `Blog ${cat.name} - CetakKartu.com`
      : 'Blog - CetakKartu.com';
    document.title = title;

    const metaDesc = document.querySelector('meta[name="description"]');
    const desc = cat
      ? `Artikel seputar ${cat.name.toLowerCase()} — tips, panduan, dan informasi terkini.`
      : 'Blog CetakKartu.com — artikel, tips, dan panduan seputar kartu identitas digital, pendidikan, dan teknologi.';
    if (metaDesc) metaDesc.setAttribute('content', desc);
  }, [categorySlug, categories]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage.toString() });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const breadcrumbItems = [
    { label: 'Beranda', to: '/' },
    { label: 'Blog', to: '/blog' },
  ];

  if (categorySlug) {
    const cat = categories.find(c => c.slug === categorySlug);
    breadcrumbItems.push({
      label: cat?.name || categorySlug,
    });
  }

  return (
    <div className="blog-page">
      {/* Hero */}
      <section className="blog-hero">
        <div className="blog-hero-content">
          <h1 className="blog-hero-title">
            {categorySlug
              ? `Blog — ${categories.find(c => c.slug === categorySlug)?.name || categorySlug}`
              : 'Blog CetakKartu.com'}
          </h1>
          <p className="blog-hero-subtitle">
            Artikel, tips, dan panduan seputar kartu identitas digital, pendidikan, dan teknologi.
          </p>
        </div>
      </section>

      <div className="blog-container">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="blog-layout">
          {/* Main Content */}
          <div className="blog-main">
            {/* Category Filter Tabs */}
            <div className="blog-category-tabs">
              <a
                href="/blog"
                className={`blog-cat-tab ${!categorySlug ? 'active' : ''}`}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = '/blog';
                }}
              >
                Semua
              </a>
              {categories.map(cat => (
                <a
                  key={cat.id}
                  href={`/blog/kategori/${cat.slug}`}
                  className={`blog-cat-tab ${categorySlug === cat.slug ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = `/blog/kategori/${cat.slug}`;
                  }}
                >
                  {cat.name} ({cat.post_count})
                </a>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="blog-loading">
                <div className="blog-loading-grid">
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} className="blog-card-skeleton">
                      <div className="skeleton-image" />
                      <div className="skeleton-body">
                        <div className="skeleton-line short" />
                        <div className="skeleton-line" />
                        <div className="skeleton-line medium" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Error */}
            {error && !loading && (
              <div className="blog-error">
                <div className="blog-error-icon">⚠️</div>
                <h3>Gagal memuat artikel</h3>
                <p>{error}</p>
              </div>
            )}

            {/* Empty */}
            {!loading && !error && posts.length === 0 && (
              <div className="blog-empty">
                <div className="blog-empty-icon">📝</div>
                <h3>Belum ada artikel</h3>
                <p>
                  {categorySlug
                    ? 'Belum ada artikel di kategori ini. Silakan cek kategori lainnya.'
                    : 'Artikel akan segera tersedia. Kunjungi kembali nanti!'}
                </p>
              </div>
            )}

            {/* Posts Grid */}
            {!loading && !error && posts.length > 0 && (
              <>
                <div className="blog-grid">
                  {posts.map(post => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>

                <Pagination pagination={pagination} onPageChange={handlePageChange} />
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="blog-sidebar">
            <div className="blog-sidebar-widget">
              <h3>📁 Kategori</h3>
              <ul className="blog-sidebar-categories">
                <li>
                  <a
                    href="/blog"
                    className={!categorySlug ? 'active' : ''}
                  >
                    Semua Artikel
                  </a>
                </li>
                {categories.map(cat => (
                  <li key={cat.id}>
                    <a
                      href={`/blog/kategori/${cat.slug}`}
                      className={categorySlug === cat.slug ? 'active' : ''}
                    >
                      {cat.name}
                      <span className="cat-count">{cat.post_count}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="blog-sidebar-widget">
              <h3>🪪 Tentang CetakKartu</h3>
              <p>Platform modern untuk membuat dan mencetak kartu identitas digital secara gratis dan profesional.</p>
              <a href="/nisn" className="blog-sidebar-cta">Buat Kartu NISN →</a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
