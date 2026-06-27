import { useState } from 'react';
import { useAdminCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../hooks/useAdmin';

export default function AdminCategories() {
  const { data: categories, loading, error, refetch } = useAdminCategories();
  const { create, loading: creating } = useCreateCategory();
  const { update, loading: updating } = useUpdateCategory();
  const { remove, loading: deleting } = useDeleteCategory();

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formError, setFormError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setEditId(null);
    setShowForm(false);
    setFormError('');
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('Nama kategori wajib diisi.');
      return;
    }

    try {
      if (editId) {
        await update(editId, { name: name.trim(), description: description.trim() });
      } else {
        await create({ name: name.trim(), description: description.trim() });
      }
      resetForm();
      refetch();
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await remove(id);
      setDeleteConfirm(null);
      refetch();
    } catch {
      // handled in hook
    }
  };

  return (
    <div className="admin-categories">
      <div className="admin-page-header">
        <h2>📁 Kategori</h2>
        <button
          className="admin-btn-primary"
          onClick={() => { resetForm(); setShowForm(true); }}
        >
          + Tambah Kategori
        </button>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="admin-category-form">
          <h3>{editId ? 'Edit Kategori' : 'Tambah Kategori Baru'}</h3>
          {formError && <div className="admin-error">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="admin-form-group">
              <label htmlFor="cat-name">Nama Kategori</label>
              <input
                id="cat-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Nama kategori"
                autoFocus
              />
            </div>
            <div className="admin-form-group">
              <label htmlFor="cat-desc">Deskripsi (opsional)</label>
              <input
                id="cat-desc"
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Deskripsi singkat"
              />
            </div>
            <div className="admin-form-actions">
              <button
                type="submit"
                className="admin-btn-primary"
                disabled={creating || updating}
              >
                {creating || updating ? 'Menyimpan...' : '💾 Simpan'}
              </button>
              <button
                type="button"
                className="admin-btn-secondary"
                onClick={resetForm}
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      {loading ? (
        <div className="admin-loading">Memuat kategori...</div>
      ) : categories.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">📁</div>
          <h3>Belum ada kategori</h3>
          <p>Klik "Tambah Kategori" untuk menambahkan.</p>
        </div>
      ) : (
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Slug</th>
                <th>Artikel</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map(cat => (
                <tr key={cat.id}>
                  <td>
                    <div className="admin-cat-name">{cat.name}</div>
                    {cat.description && <div className="admin-cat-desc">{cat.description}</div>}
                  </td>
                  <td><code>{cat.slug}</code></td>
                  <td>{cat.post_count || 0}</td>
                  <td className="admin-actions-cell">
                    <button
                      className="admin-action-btn edit"
                      onClick={() => handleEdit(cat)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="admin-action-btn delete"
                      onClick={() => setDeleteConfirm(cat.id)}
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
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="admin-modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <h3>🗑️ Hapus Kategori?</h3>
            <p>Kategori akan dihapus, artikel yang terkait akan kehilangan kategorinya.</p>
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
