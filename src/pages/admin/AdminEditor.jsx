import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAdminPost, useCreatePost, useUpdatePost } from '../../hooks/useAdmin';
import { useAdminCategories } from '../../hooks/useAdmin';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export default function AdminEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  // Existing post data
  const { post: existingPost, loading: loadingPost } = useAdminPost(id);
  const { create, loading: creating } = useCreatePost();
  const { update, loading: updating } = useUpdatePost();
  const { data: categories } = useAdminCategories();

  const saving = creating || updating;

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [autoSlug, setAutoSlug] = useState(true);
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('draft');
  const [publishedAt, setPublishedAt] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const initialContentSet = useRef(false);

  // Populate form when editing
  useEffect(() => {
    if (existingPost) {
      setTitle(existingPost.title || '');
      setSlug(existingPost.slug || '');
      setContent(existingPost.content || '');
      setExcerpt(existingPost.excerpt || '');
      setFeaturedImage(existingPost.featured_image || '');
      setCategoryId(existingPost.category_id ? String(existingPost.category_id) : '');
      setTagsInput((existingPost.tags || []).join(', '));
      setStatus(existingPost.status || 'draft');
      setPublishedAt(existingPost.published_at ? existingPost.published_at.slice(0, 16) : '');
    }
  }, [existingPost]);

  // Set initial content in editor (without React re-rendering on every keystroke)
  useEffect(() => {
    if (editorRef.current && existingPost && !initialContentSet.current) {
      editorRef.current.innerHTML = existingPost.content || '';
      initialContentSet.current = true;
    }
    if (!existingPost && editorRef.current) {
      editorRef.current.innerHTML = '';
      initialContentSet.current = false;
    }
  }, [existingPost]);

  // Auto-slug from title
  const handleTitleChange = (val) => {
    setTitle(val);
    if (autoSlug) {
      setSlug(slugify(val));
    }
  };

  // Image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await api.upload(file);
      // Insert image into editor content
      if (editorRef.current) {
        const img = document.createElement('img');
        img.src = result.url;
        img.alt = file.name;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
        img.style.borderRadius = '8px';
        img.style.margin = '1rem 0';

        const sel = window.getSelection();
        if (sel.rangeCount && editorRef.current.contains(sel.anchorNode)) {
          const range = sel.getRangeAt(0);
          range.insertNode(img);
          range.collapse(false);
        } else {
          editorRef.current.appendChild(img);
        }

        // Update content state
        setContent(editorRef.current.innerHTML);
      }
    } catch (err) {
      setError('Gagal upload gambar: ' + err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Featured image upload
  const handleFeaturedUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await api.upload(file);
      setFeaturedImage(result.url);
    } catch (err) {
      setError('Gagal upload featured image: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const handleEditorInput = useCallback(() => {
    if (editorRef.current) {
      setContent(editorRef.current.innerHTML);
    }
  }, []);

  // Toolbar actions
  const execCmd = (cmd, val = null) => {
    document.execCommand(cmd, false, val);
    editorRef.current?.focus();
    handleEditorInput();
  };

  const handleInsertLink = () => {
    const url = prompt('Masukkan URL:');
    if (url) execCmd('createLink', url);
  };

  // Save
  const handleSave = async (newStatus) => {
    setError('');
    setSuccessMsg('');

    if (!title.trim()) {
      setError('Judul artikel wajib diisi.');
      return;
    }

    const postData = {
      title: title.trim(),
      slug: slug.trim() || slugify(title.trim()),
      content,
      excerpt: excerpt || content.replace(/<[^>]*>/g, '').slice(0, 160),
      featured_image: featuredImage,
      category_id: categoryId ? parseInt(categoryId) : null,
      tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
      status: newStatus || status,
      published_at: newStatus === 'scheduled' ? new Date(publishedAt).toISOString() : undefined,
    };

    try {
      if (isEditing) {
        await update(id, postData);
      } else {
        await create(postData);
      }
      setSuccessMsg(
        newStatus === 'published'
          ? 'Artikel berhasil dipublikasikan!'
          : newStatus === 'scheduled'
            ? 'Artikel dijadwalkan!'
            : 'Artikel disimpan sebagai draft.'
      );

      if (newStatus === 'published' || newStatus === 'scheduled') {
        setTimeout(() => navigate('/jaka'), 1500);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (isEditing && loadingPost) {
    return <div className="admin-loading">Memuat artikel...</div>;
  }

  return (
    <div className="admin-editor">
      <div className="admin-page-header">
        <h2>{isEditing ? '✏️ Edit Artikel' : '✏️ Tulis Artikel Baru'}</h2>
        <div className="admin-editor-actions">
          <button className="admin-btn-secondary" onClick={() => navigate('/jaka')}>
            ← Kembali
          </button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}
      {successMsg && <div className="admin-success">{successMsg}</div>}

      <div className="admin-editor-form">
        {/* Title */}
        <div className="admin-form-group">
          <label htmlFor="post-title">Judul Artikel *</label>
          <input
            id="post-title"
            type="text"
            value={title}
            onChange={e => handleTitleChange(e.target.value)}
            placeholder="Masukkan judul artikel..."
            className="admin-input-title"
          />
        </div>

        {/* Slug */}
        <div className="admin-form-group">
          <label htmlFor="post-slug">Slug URL</label>
          <div className="admin-slug-row">
            <span className="admin-slug-prefix">/blog/</span>
            <input
              id="post-slug"
              type="text"
              value={slug}
              onChange={e => { setSlug(e.target.value); setAutoSlug(false); }}
              placeholder="judul-artikel"
              className="admin-input-slug"
            />
            <label className="admin-auto-slug">
              <input
                type="checkbox"
                checked={autoSlug}
                onChange={e => {
                  setAutoSlug(e.target.checked);
                  if (e.target.checked) setSlug(slugify(title));
                }}
              />
              {' '}Auto
            </label>
          </div>
        </div>

        {/* Featured Image */}
        <div className="admin-form-group">
          <label>Featured Image</label>
          <div className="admin-featured-upload">
            {featuredImage ? (
              <div className="admin-featured-preview">
                <img src={featuredImage} alt="Featured" />
                <button
                  className="admin-featured-remove"
                  onClick={() => setFeaturedImage('')}
                >
                  ✕
                </button>
              </div>
            ) : (
              <label className="admin-upload-area">
                <span>🖼️ Klik untuk upload featured image</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleFeaturedUpload}
                  hidden
                  disabled={uploading}
                />
              </label>
            )}
          </div>
        </div>

        {/* Category & Tags */}
        <div className="admin-form-row">
          <div className="admin-form-group admin-form-half">
            <label htmlFor="post-category">Kategori</label>
            <select
              id="post-category"
              value={categoryId}
              onChange={e => setCategoryId(e.target.value)}
            >
              <option value="">— Pilih Kategori —</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <div className="admin-form-group admin-form-half">
            <label htmlFor="post-tags">Tags (pisahkan dengan koma)</label>
            <input
              id="post-tags"
              type="text"
              value={tagsInput}
              onChange={e => setTagsInput(e.target.value)}
              placeholder="contoh: nisn, pendidikan, sekolah"
            />
          </div>
        </div>

        {/* Rich Text Editor */}
        <div className="admin-form-group">
          <label>Konten Artikel</label>
          <div className="admin-editor-toolbar">
            <button type="button" onClick={() => execCmd('bold')} title="Bold"><b>B</b></button>
            <button type="button" onClick={() => execCmd('italic')} title="Italic"><i>I</i></button>
            <button type="button" onClick={() => execCmd('underline')} title="Underline"><u>U</u></button>
            <span className="toolbar-sep" />
            <button type="button" onClick={() => execCmd('formatBlock', '<h2>')} title="Heading 2">H2</button>
            <button type="button" onClick={() => execCmd('formatBlock', '<h3>')} title="Heading 3">H3</button>
            <button type="button" onClick={() => execCmd('formatBlock', '<p>')} title="Paragraph">P</button>
            <span className="toolbar-sep" />
            <button type="button" onClick={() => execCmd('insertUnorderedList')} title="Bullet List">•≡</button>
            <button type="button" onClick={() => execCmd('insertOrderedList')} title="Numbered List">1≡</button>
            <button type="button" onClick={() => execCmd('formatBlock', '<blockquote>')} title="Blockquote">❝</button>
            <span className="toolbar-sep" />
            <button type="button" onClick={handleInsertLink} title="Insert Link">🔗</button>
            <label className="toolbar-upload-btn" title="Upload Image">
              📷
              <input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleImageUpload}
                ref={fileInputRef}
                hidden
                disabled={uploading}
              />
            </label>
            {uploading && <span className="toolbar-uploading">Uploading...</span>}
          </div>
          <div
            ref={editorRef}
            className="admin-rich-editor"
            contentEditable
            onInput={handleEditorInput}
            data-placeholder="Mulai menulis artikel..."
          />
        </div>

        {/* Excerpt */}
        <div className="admin-form-group">
          <label htmlFor="post-excerpt">Ringkasan / Excerpt (untuk SEO & listing)</label>
          <textarea
            id="post-excerpt"
            value={excerpt}
            onChange={e => setExcerpt(e.target.value)}
            placeholder="Ringkasan singkat artikel (maks 160 karakter)"
            rows={3}
            className="admin-textarea"
          />
          <small className="admin-help">{excerpt.length}/160 karakter</small>
        </div>

        {/* Status & Publish */}
        <div className="admin-form-group">
          <label>Status Publikasi</label>
          <div className="admin-status-options">
            <label className={`admin-status-option ${status === 'draft' ? 'active' : ''}`}>
              <input
                type="radio"
                name="status"
                value="draft"
                checked={status === 'draft'}
                onChange={e => setStatus(e.target.value)}
              />
              <span>📝 Draft</span>
            </label>
            <label className={`admin-status-option ${status === 'published' ? 'active' : ''}`}>
              <input
                type="radio"
                name="status"
                value="published"
                checked={status === 'published'}
                onChange={e => setStatus(e.target.value)}
              />
              <span>✅ Publish</span>
            </label>
            <label className={`admin-status-option ${status === 'scheduled' ? 'active' : ''}`}>
              <input
                type="radio"
                name="status"
                value="scheduled"
                checked={status === 'scheduled'}
                onChange={e => setStatus(e.target.value)}
              />
              <span>⏰ Scheduled</span>
            </label>
          </div>

          {status === 'scheduled' && (
            <div className="admin-schedule-input">
              <label htmlFor="post-schedule">Jadwal Tayang</label>
              <input
                id="post-schedule"
                type="datetime-local"
                value={publishedAt}
                onChange={e => setPublishedAt(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="admin-editor-bottom-actions">
          <button
            className="admin-btn-secondary"
            onClick={() => handleSave('draft')}
            disabled={saving}
          >
            💾 Simpan Draft
          </button>
          {status === 'scheduled' ? (
            <button
              className="admin-btn-primary"
              onClick={() => handleSave('scheduled')}
              disabled={saving || !publishedAt}
            >
              {saving ? '⏳ Menyimpan...' : '⏰ Jadwalkan'}
            </button>
          ) : (
            <button
              className="admin-btn-primary"
              onClick={() => handleSave('published')}
              disabled={saving}
            >
              {saving ? '⏳ Menyimpan...' : '🚀 Publish'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
