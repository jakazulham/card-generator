import React from 'react';
import { Link } from 'react-router-dom';

const cardTemplates = [
  {
    id: 'nisn',
    name: 'Kartu NISN',
    icon: '🎓',
    desc: 'Kartu Nomor Induk Siswa Nasional — identitas resmi pelajar di seluruh Indonesia.',
    features: ['3 template premium', 'QR Code otomatis', 'ISO 7810 ID-1'],
    color: '#2563eb',
    route: '/nisn',
    available: true,
  },
  {
    id: 'bpjs',
    name: 'Kartu BPJS',
    icon: '🏥',
    desc: 'Kartu BPJS Kesehatan — salinan digital kartu jaminan kesehatan nasional.',
    features: ['6 field data', 'Export PNG & PDF', 'ISO 7810 ID-1'],
    color: '#16a34a',
    route: '/bpjs',
    available: true,
  },
  {
    id: 'pelajar',
    name: 'Kartu Pelajar',
    icon: '📚',
    desc: 'Kartu identitas pelajar modern untuk sekolah dan institusi pendidikan.',
    features: ['Segera hadir'],
    color: '#0891b2',
    route: null,
    available: false,
  },
  {
    id: 'nuptk',
    name: 'Kartu NUPTK',
    icon: '👨‍🏫',
    desc: 'Nomor Unik Pendidik dan Tenaga Kependidikan — untuk guru dan tenaga pendidik.',
    features: ['Segera hadir'],
    color: '#7c3aed',
    route: null,
    available: false,
  },
  {
    id: 'kip',
    name: 'Kartu KIP/PIP',
    icon: '💰',
    desc: 'Kartu Indonesia Pintar — program bantuan pendidikan dari pemerintah.',
    features: ['Segera hadir'],
    color: '#ea580c',
    route: null,
    available: false,
  },
  {
    id: 'nrg',
    name: 'Kartu NRG',
    icon: '📋',
    desc: 'Nomor Registrasi Guru — identitas resmi guru bersertifikasi.',
    features: ['Segera hadir'],
    color: '#e11d48',
    route: null,
    available: false,
  },
];

export default function CardSelector() {
  return (
    <div className="selector-page">
      <div className="bg-decorations">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>

      <div className="selector-container">
        <div className="selector-header">
          <h1 className="responsive-page-title">Pilih Kartu yang Ingin Dibuat</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
            Pilih jenis kartu yang sesuai dengan kebutuhan Anda. Semua generator kartu gratis dan data Anda diproses aman di browser.
          </p>
        </div>

        <div className="selector-grid">
          {cardTemplates.map(card => (
            <div key={card.id} className={`selector-card ${!card.available ? 'disabled' : ''}`}>
              <div className="selector-card-badge" style={{ background: card.color }}>
                {card.icon}
              </div>
              <h3>{card.name}</h3>
              <p>{card.desc}</p>
              <ul className="selector-card-features">
                {card.features.map((f, i) => (
                  <li key={i}>{card.available ? '✓' : '⌛'} {f}</li>
                ))}
              </ul>
              {card.available ? (
                <Link to={card.route} className="selector-card-btn" style={{ background: card.color }}>
                  Buat Sekarang →
                </Link>
              ) : (
                <span className="selector-card-soon">Segera Hadir</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
