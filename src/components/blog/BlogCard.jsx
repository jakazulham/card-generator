import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  const {
    title, slug, excerpt, featured_image, category_name,
    category_slug,
  } = post;

  return (
    <article className="blog-card">
      <Link to={`/blog/${slug}`} className="blog-card-image-link">
        {featured_image ? (
          <img
            src={featured_image}
            alt={title}
            className="blog-card-image"
            loading="lazy"
          />
        ) : (
          <div className="blog-card-image-placeholder">
            <span>📝</span>
          </div>
        )}
      </Link>

      <div className="blog-card-body">
        {category_name && (
          <Link
            to={`/blog/kategori/${category_slug}`}
            className="blog-card-category"
          >
            {category_name}
          </Link>
        )}

        <Link to={`/blog/${slug}`} className="blog-card-title-link">
          <h3 className="blog-card-title">{title}</h3>
        </Link>

        {excerpt && (
          <p className="blog-card-excerpt">
            {excerpt.length > 150 ? excerpt.slice(0, 150) + '...' : excerpt}
          </p>
        )}

        <div className="blog-card-meta">
          <Link to={`/blog/${slug}`} className="blog-card-readmore">
            Baca Selengkapnya →
          </Link>
        </div>
      </div>
    </article>
  );
}
