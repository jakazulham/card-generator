import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

// Format date to local ID format (DD MMMM YYYY)
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
        {/* Front faces are pre-designed template images */}
      </div>
    </div>
  );
}

export function CardBack({ templateId, data, exportMode }) {
  const { name = '', nisn = '', birthPlace = '', birthDate = '', gender = '' } = data;

  const getTemplateClass = () => {
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
        {/* Left Side: QR Code in placeholder box */}
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

        {/* Right Side: Clean aligned details table */}
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

export default function CardPreview({ data, templateId, isFlipped, onFlip, containerRef, exportMode }) {
  return (
    <div className="preview-container">
      {/* 3D Flip Card */}
      <div className="card-3d-wrapper" onClick={onFlip} title="Klik untuk membalik kartu">
        <div 
          ref={containerRef}
          className={`card-3d-inner ${isFlipped ? 'flipped' : ''}`}
        >
          <CardFront templateId={templateId} />
          <CardBack templateId={templateId} data={data} exportMode={exportMode} />
        </div>
      </div>
      
      {/* Visual Hint */}
      <span className="preview-hint">
        🔄 Klik kartu untuk melihat bagian belakang
      </span>
    </div>
  );
}
