import React from 'react';

export default function ErrorNotification({ message, onClose, onRetry }) {
  if (!message) return null;

  return (
    <div className="notification-overlay">
      <div className="notification-box" role="dialog" aria-modal="true">
        <div className="notification-icon" aria-hidden="true">
          ⚠️
        </div>
        <h3 className="notification-title">Ekspor Kartu Gagal</h3>
        <p className="notification-desc">
          Terjadi kesalahan saat memproses gambar atau menyusun berkas PDF Anda.
          Silakan coba lagi.
          {message && typeof message === 'string' && (
            <span style={{ display: 'block', fontSize: '0.8rem', opacity: 0.7, marginTop: '0.5rem', fontFamily: 'monospace' }}>
              Detail: {message}
            </span>
          )}
        </p>
        <div className="notification-actions">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={onClose}
          >
            Batal
          </button>
          <button 
            type="button" 
            className="btn btn-primary btn-retry" 
            onClick={onRetry}
          >
            🔄 Coba Lagi
          </button>
        </div>
      </div>
    </div>
  );
}
