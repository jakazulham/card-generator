import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAdminPosts, useDeletePost } from '../../hooks/useAdmin';

const STATUS_MAP = {
  draft: { label: 'Draft', className: 'badge-draft' },
  published: { label: 'Published', className: 'badge-published' },
  scheduled: { label: 'Scheduled', className: 'badge-scheduled' },
};

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AdminDashboard() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const { data: posts, pagination, loading, error, refetch } = useAdminPosts(page, status, search);
  const { remove, loading: deleting } = useDeletePost();
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    try {
      await remove(id);
      setDeleteConfirm(null);
      refetch();
    } catch {
      // error handled in hook
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h2>📋 Dashboard</h2>
        <Link to="/jaka/posts/new" className="admin-btn-primary">+ Tulis Artikel Baru</Link>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-status-tabs">
          {['all', 'published', 'draft', 'scheduled'].map(s => (
            <button
              key={s}
              className={`admin-tab ${status === s ? 'active' : ''}`}
              onClick={() => { setStatus(s); setPage(1); }}
            >
              {s === 'all' ? 'Semua' : s === 'published' ? 'Published' : s === 'draft' ? 'Draft' : 'Scheduled'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSearch} className="admin-search-form">
          <input
            type="text"
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Cari artikel..."
            className="admin-search-input"
          />
          <button type="submit" className="admin-search-btn">🔍</button>
        </form>
      </div>

      {/* Error */}
      {error && <div className="admin-error">{error}</div>}

      {/* Posts Table */}
      {loading ? (
        <div className="admin-loading">Memuat artikel...</div>
      ) : posts.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📝</div>
          <h3>Belum ada artikel</h3>
          <p>Klik "Tulis Artikel Baru" untuk mulai menulis.</p>
        </div>
      ) : (
        <>
          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Status</th>
                  <th>Kategori</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id}>
                    <td className="admin-post-title-cell">
                      <div className="admin-post-title">{post.title}</div>
                      <div className="admin-post-slug">/{post.slug}</div>
                    </td>
                    <td>
                      <span className={`admin-badge ${STATUS_MAP[post.status]?.className || ''}`}>
                        {STATUS_MAP[post.status]?.label || post.status}
                      </span>
                    </td>
                    <td>{post.category_name || '—'}</td>
                    <td>
                      <div className="admin-date">
                        {post.status === 'published'
                          ? formatDate(post.published_at)
                          : formatDate(post.created_at)}
                      </div>
                    </td>
                    <td className="admin-actions-cell">
                      <button
                        className="admin-action-btn edit"
                        onClick={() => navigate(`/jaka/posts/edit/${post.id}`)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => setDeleteConfirm(post.id)}
                        title="Hapus"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="admin-pagination">
              <button
                disabled={page <= 1}
                onClick={() => setPage(p => p - 1)}
              >
                ← Sebelumnya
              </button>
              <span className="admin-page-info">
                Halaman {page} dari {pagination.totalPages} ({pagination.total} artikel)
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Selanjutnya →
              </button>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>🗑️ Hapus Artikel?</h3>
            <p>Artikel yang dihapus tidak dapat dikembalikan.</p>
            <div className="admin-modal-actions">
              <button
                className="admin-btn-secondary"
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
              >
                Batal
              </button>
              <button
                className="admin-btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={deleting}
              >
                {deleting ? 'Menghapus...' : 'Hapus'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
