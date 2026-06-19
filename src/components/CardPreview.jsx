import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// =============================================================================
// Komponen Pratinjau Kartu — PRD Bagian 4.1: Live Preview & QR Code
// Template latar belakang kartu dimuat dari folder /assets/ via CSS
// (lihat index.css: .card-m{1,2,3}-front, .card-m{1,2,3}-back)
// =============================================================================

// ---------------------------------------------------------------------------
// Helper: format tanggal ke bahasa Indonesia (DD MMMM YYYY)
// ---------------------------------------------------------------------------
const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

// =============================================================================
// CardFront — Sisi Depan Kartu (template dari /assets/ via CSS background)
// PRD Bagian 5.1: Model 1/2/3 masing-masing memiliki desain front-end sendiri
// =============================================================================
export function CardFront({ templateId }) {
  const getTemplateClass = () => {
    if (templateId === 1) return 'card-m1-front';
    if (templateId === 2) return 'card-m2-front';
    if (templateId === 3) return 'card-m3-front';
    return '';
  };

  return (
    <div className={`card-face card-face-front ${getTemplateClass()}`}>
      <div className="card-content-front">
        {/* Sisi depan menggunakan template gambar dari /assets/ sebagai background CSS */}
      </div>
    </div>
  );
}

// =============================================================================
// CardBack — Sisi Belakang Kartu (template dari /assets/ + QR Code + data siswa)
// PRD Bagian 4.1: QR Code otomatis berdasarkan NISN
// PRD Bagian 5.2: Tata letak data — QR kiri, teks info kanan
// =============================================================================
export function CardBack({ templateId, data, exportMode }) {
  const { name = '', nisn = '', birthPlace = '', birthDate = '', gender = '' } = data;

  const getTemplateClass = () => {
    // Saat exportMode, background template dihilangkan — html2canvas
    // hanya menangkap overlay teks untuk dikomposisi ulang secara native
    if (exportMode) return '';
    if (templateId === 1) return 'card-m1-back';
    if (templateId === 2) return 'card-m2-back';
    if (templateId === 3) return 'card-m3-back';
    return '';
  };

  const qrWrapperClass = `qr-wrapper-t${templateId}`;

  return (
    <div className={`card-face card-face-back ${getTemplateClass()}`}>
      <div className="card-content-back">
        {/* ==================================================================
            QR Code — PRD Bagian 4.1: Pembangkit QR Code berdasarkan NISN
            Posisi: kiri bawah kartu (PRD Bagian 5.2)
            ================================================================== */}
        <div className={`qr-absolute-container ${qrWrapperClass}`}>
          <QRCodeSVG
            value={nisn || '0000000000'}
            size={120}
            bgColor="transparent"
            fgColor="#000000"
            level="H"
            includeMargin={false}
          />
        </div>

        {/* ==================================================================
            Tabel Data Siswa — PRD Bagian 5.2: Tata Letak Data Kartu Belakang
            Label: NISN, Nama, Tempat Lahir, Tanggal Lahir, Jenis Kelamin
            ================================================================== */}
        <div className="card-details-table">
          <span className="card-detail-label">NISN</span>
          <span className="card-detail-sep">:</span>
          <span className="card-detail-value nisn-value">{nisn || '0000000000'}</span>

          <span className="card-detail-label">Nama Lengkap</span>
          <span className="card-detail-sep">:</span>
          <span className="card-detail-value">{name || 'NAMA SISWA'}</span>

          <span className="card-detail-label">Tempat Lahir</span>
          <span className="card-detail-sep">:</span>
          <span className="card-detail-value">{birthPlace || 'TEMPAT LAHIR'}</span>

          <span className="card-detail-label">Tanggal Lahir</span>
          <span className="card-detail-sep">:</span>
          <span className="card-detail-value">{formatDate(birthDate)}</span>

          <span className="card-detail-label">Jenis Kelamin</span>
          <span className="card-detail-sep">:</span>
          <span className="card-detail-value">{gender || 'LAKI-LAKI'}</span>
        </div>

      </div>
    </div>
  );
}

// =============================================================================
// CardPreview — Wrapper 3D Flip interaktif
// PRD Bagian 4.1: Live Preview real-time
// PRD Bagian 4.2: Animasi flip kartu 3D
// =============================================================================
export default function CardPreview({ data, templateId, isFlipped, onFlip, containerRef, exportMode }) {
  return (
    <div className="preview-container">
      {/* 3D Flip Card — klik untuk membalik */}
      <div className="card-3d-wrapper" onClick={onFlip} title="Klik untuk membalik kartu">
        <div
          ref={containerRef}
          className={`card-3d-inner ${isFlipped ? 'flipped' : ''}`}
        >
          <CardFront templateId={templateId} />
          <CardBack templateId={templateId} data={data} exportMode={exportMode} />
        </div>
      </div>

      {/* Petunjuk visual */}
      <span className="preview-hint">
        🔄 Klik kartu untuk melihat bagian belakang
      </span>
    </div>
  );
}
