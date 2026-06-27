import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const templates = [
  {
    id: 'nisn',
    name: 'Kartu NISN',
    subtitle: 'Nomor Induk Siswa Nasional',
    icon: '🎓',
    desc: 'Kartu identitas resmi pelajar dengan QR Code otomatis. Tersedia 3 pilihan template premium.',
    features: ['3 Template Premium', 'QR Code Otomatis', 'Export PNG & PDF', 'ISO 7810 ID-1'],
    color: '#2563eb',
    colorLight: '#dbeafe',
    route: '/nisn',
    available: true,
    previews: ['/assets/template_front_1.png', '/assets/template_front_2.png', '/assets/template_front_3.png'],
  },
  {
    id: 'bpjs',
    name: 'Kartu BPJS',
    subtitle: 'Jaminan Kesehatan Nasional',
    icon: '🏥',
    desc: 'Salinan digital Kartu BPJS Kesehatan dengan 6 field data lengkap. Siap cetak ukuran standar.',
    features: ['6 Field Data Lengkap', 'Export PNG & PDF', 'ISO 7810 ID-1', 'Gratis Selamanya'],
    color: '#16a34a',
    colorLight: '#dcfce7',
    route: '/bpjs',
    available: true,
    previews: ['/assets/bpjs_front.png'],
  },
  {
    id: 'pelajar',
    name: 'Kartu Pelajar',
    subtitle: 'Identitas Sekolah Modern',
    icon: '📚',
    desc: 'Template kartu pelajar custom untuk sekolah. Desain modern, data lengkap, siap cetak.',
    features: ['Segera Hadir'],
    color: '#0d9488',
    colorLight: '#ccfbf1',
    route: null,
    available: false,
    previews: [],
  },
  {
    id: 'nuptk',
    name: 'Kartu NUPTK',
    subtitle: 'Guru & Tenaga Pendidik',
    icon: '👨‍🏫',
    desc: 'Nomor Unik Pendidik dan Tenaga Kependidikan untuk guru bersertifikasi.',
    features: ['Segera Hadir'],
    color: '#7c3aed',
    colorLight: '#ede9fe',
    route: null,
    available: false,
    previews: [],
  },
  {
    id: 'kip',
    name: 'Kartu KIP / PIP',
    subtitle: 'Program Bantuan Pendidikan',
    icon: '💰',
    desc: 'Kartu Indonesia Pintar — identitas penerima bantuan pendidikan pemerintah.',
    features: ['Segera Hadir'],
    color: '#ea580c',
    colorLight: '#fff7ed',
    route: null,
    available: false,
    previews: [],
  },
  {
    id: 'nrg',
    name: 'Kartu NRG',
    subtitle: 'Registrasi Guru',
    icon: '📋',
    desc: 'Nomor Registrasi Guru — identitas resmi guru bersertifikasi nasional.',
    features: ['Segera Hadir'],
    color: '#e11d48',
    colorLight: '#ffe4e6',
    route: null,
    available: false,
    previews: [],
  },
];

export default function CardSelector() {
  useEffect(() => {
    document.title = 'Pilih Template Kartu — CetakKartu.com';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Pilih dan buat kartu identitas dari berbagai template premium — NISN, BPJS, Kartu Pelajar, NUPTK, dan lainnya. Gratis, cepat, dan data aman di browser Anda.');
    }
  }, []);

  return (
    <div className="selector-page">
      <div className="bg-decorations">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>

      <div className="templates-container">
        {/* Header */}
        <div className="templates-header">
          <span className="templates-badge">✨ Pilih Template</span>
          <h1 className="responsive-page-title">Template Kartu Premium</h1>
          <p className="templates-header-desc">
            Pilih template kartu yang sesuai kebutuhan. Semua template gratis, data Anda diproses secara aman di browser tanpa diunggah ke server.
          </p>
        </div>

        {/* Template Cards */}
        <div className="templates-grid">
          {templates.map(tmpl => (
            <div key={tmpl.id} className={`template-showcase-card ${!tmpl.available ? 'disabled' : ''}`}>
              {/* Preview Thumbnails */}
              <div className="template-showcase-preview" style={{ background: tmpl.colorLight }}>
                {tmpl.previews.length > 0 ? (
                  <div className={tmpl.previews.length > 1 ? 'template-preview-stack' : 'template-preview-single'}>
                    {tmpl.previews.slice(0, 3).map((src, i) => (
                      <img
                        key={i}
                        src={src}
                        alt={`${tmpl.name} Template ${i + 1}`}
                        className={`template-preview-img stack-${i}`}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="template-preview-placeholder">
                    <span className="template-preview-icon">{tmpl.icon}</span>
                    <span>Preview Segera</span>
                  </div>
                )}
                {!tmpl.available && (
                  <div className="template-coming-overlay">
                    <span>Segera Hadir</span>
                  </div>
                )}
                {tmpl.previews.length > 1 && (
                  <span className="template-count-badge">{tmpl.previews.length} Template</span>
                )}
              </div>

              {/* Info */}
              <div className="template-showcase-info">
                <div className="template-showcase-header">
                  <span className="template-showcase-icon" style={{ background: tmpl.color }}>{tmpl.icon}</span>
                  <div>
                    <h3>{tmpl.name}</h3>
                    <span className="template-showcase-subtitle">{tmpl.subtitle}</span>
                  </div>
                </div>
                <p>{tmpl.desc}</p>
                <ul className="template-showcase-features">
                  {tmpl.features.map((f, i) => (
                    <li key={i}>{tmpl.available ? '✓' : '⌛'} {f}</li>
                  ))}
                </ul>
                {tmpl.available ? (
                  <Link to={tmpl.route} className="template-showcase-btn" style={{ background: tmpl.color }}>
                    Pilih Template →
                  </Link>
                ) : (
                  <span className="template-showcase-btn disabled">Segera Hadir</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
