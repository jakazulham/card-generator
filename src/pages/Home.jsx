import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    document.title = 'Aplikasi Pembuat Kartu Instan, Template NISN, BPJS, KIP, NRG dan Kartu Lainnya';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Buat kartu NISN, BPJS, KIP, NRG, Kartu Pelajar dan semua kartu instan dengan QR Code dinamis dan pilihan template premium secara mudah dan praktis. Coba pakai template kami, gratis.');
    }
  }, []);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  const features = [
    { icon: '⚡', title: 'Sangat Cepat', desc: 'Buat kartu dalam hitungan detik tanpa perlu aplikasi desain grafis yang rumit.' },
    { icon: '🎨', title: 'Desain Premium', desc: 'Berbagai pilihan template estetik yang dirancang khusus mengikuti standar ID Card.' },
    { icon: '🔒', title: 'Privasi Terjamin', desc: 'Semua proses dilakukan di perangkat Anda (client-side), tanpa menyimpan data pribadi di server kami.' },
    { icon: '💸', title: '100% Gratis', desc: 'Layanan ini bisa digunakan oleh siapa saja, dari mana saja secara cuma-cuma selamanya.' }
  ];

  const cards = [
    { name: 'Kartu NISN', status: 'available', color: 'blue', desc: 'Sistem Informasi Siswa Nasional', route: '/nisn' },
    { name: 'Kartu BPJS', status: 'available', color: 'green', desc: 'Cetak fisik kartu jaminan kesehatan', route: '/bpjs' },
    { name: 'Kartu Pelajar', status: 'coming_soon', color: 'emerald', desc: 'Template identitas sekolah modern' },
    { name: 'Kartu NUPTK', status: 'coming_soon', color: 'purple', desc: 'Nomor Pendidik & Tenaga Kependidikan' },
    { name: 'Kartu KIP/PIP', status: 'coming_soon', color: 'orange', desc: 'Kartu Indonesia Pintar' },
    { name: 'Kartu NRG', status: 'coming_soon', color: 'rose', desc: 'Nomor Registrasi Guru' },
  ];

  const faqs = [
    { q: 'Apakah CetakKartu.com gratis?', a: 'Ya, semua layanan generator kartu kami 100% gratis digunakan oleh siapapun.' },
    { q: 'Apakah data saya aman?', a: 'Sangat aman. Aplikasi ini berjalan di browser Anda, artinya data (nama, tanggal lahir, dll) tidak pernah dikirim atau disimpan di database kami.' },
    { q: 'Bagaimana cara mencetak hasilnya?', a: 'Setelah mengisi data, Anda bisa mengunduh file dalam format PDF beresolusi tinggi, yang ukurannya sudah disesuaikan standar ID Card. Anda bisa membawanya ke percetakan atau mencetaknya sendiri.' },
    { q: 'Kapan template kartu lain tersedia?', a: 'Kami sedang mengembangkan template untuk Kartu Pelajar, BPJS, NUPTK, dan lainnya. Pantau terus website kami untuk update terbaru!' }
  ];

  return (
    <div className="landing-page">
      {/* Background Decorations */}
      <div className="bg-decorations">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">✨ V2.0 Telah Hadir - Generator Kartu NISN & BPJS!</div>
          <h1 className="hero-title">
            Cetak Kartu Digital Anda Secara <span className="highlight-blue">Instan</span> & <span className="highlight-green">Profesional</span>
          </h1>
          <p className="hero-desc">
            Platform modern untuk membuat dan mencetak ID Card, Kartu NISN, dan berbagai kartu penting lainnya dengan mudah, langsung dari browser Anda tanpa keahlian desain.
          </p>
          <div className="hero-actions">
            <button className="btn btn-primary btn-large" onClick={() => navigate('/buat-kartu')}>
              Buat Kartu Sekarang ➔
            </button>
            <a href="#services" className="btn btn-secondary btn-large">
              Lihat Layanan
            </a>
          </div>
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-num">50k+</span>
              <span className="stat-label">Kartu Dibuat</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">100%</span>
              <span className="stat-label">Gratis & Aman</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">4.9/5</span>
              <span className="stat-label">Rating Pengguna</span>
            </div>
          </div>
        </div>
        
        {/* Card Mockup — clean stacked design with float animation */}
        <div className="hero-visual-v2">
          <div className="hero-card-stack">
            {/* Shadow card behind */}
            <div className="hero-card hero-card-shadow"></div>
            {/* Main front card */}
            <div className="hero-card hero-card-main">
              <div className="mock-card-header">
                <div className="mock-logo"></div>
                <div className="mock-title">KARTU IDENTITAS</div>
              </div>
              <div className="mock-card-body">
                <div className="mock-photo"></div>
                <div className="mock-lines">
                  <div className="mock-line w-full"></div>
                  <div className="mock-line w-3/4"></div>
                  <div className="mock-line w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-header">
          <h2>Layanan Kami</h2>
          <p>Pilih jenis kartu yang ingin Anda buat hari ini.</p>
        </div>
        <div className="services-grid">
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              className={`service-card ${card.status}`}
              onClick={() => card.route ? navigate(card.route) : null}
            >
              <div className={`service-icon icon-${card.color}`}>
                {card.status === 'available' ? '✓' : '⌛'}
              </div>
              <div className="service-info">
                <h3>{card.name}</h3>
                <p>{card.desc}</p>
              </div>
              {card.status === 'coming_soon' && <span className="badge-soon">Segera</span>}
            </div>
          ))}
        </div>
      </section>

      {/* How it Works Section */}
      <section className="steps-section">
        <div className="section-header">
          <h2>Cara Kerja Sangat Mudah</h2>
          <p>Hanya dengan 3 langkah sederhana, kartu Anda siap dicetak.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Pilih & Input Data</h3>
            <p>Pilih template kartu yang sesuai dan isi form data diri (Nama, Nomor, dll) yang dibutuhkan.</p>
          </div>
          <div className="step-line"></div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Live Preview</h3>
            <p>Lihat pratinjau hasil desain Anda secara real-time. Pastikan semua informasi sudah benar sebelum diunduh.</p>
          </div>
          <div className="step-line"></div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Unduh & Cetak</h3>
            <p>Unduh kartu dalam format PNG resolusi tinggi atau PDF siap cetak dengan ukuran presisi standar ISO.</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <h2>Mengapa Memilih Kami?</h2>
          <p>Kami merancang platform ini dengan memprioritaskan kenyamanan pengguna.</p>
        </div>
        <div className="features-grid">
          {features.map((feat, idx) => (
            <div key={idx} className="feature-card">
              <div className="feature-icon">{feat.icon}</div>
              <h3>{feat.title}</h3>
              <p>{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="section-header">
          <h2>Pertanyaan Umum (FAQ)</h2>
          <p>Jawaban untuk pertanyaan yang sering diajukan.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, idx) => (
            <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
              <button className="faq-question" onClick={() => toggleFaq(idx)}>
                {faq.q}
                <span className="faq-toggle">{activeFaq === idx ? '−' : '+'}</span>
              </button>
              {activeFaq === idx && (
                <div className="faq-answer">
                  <p>{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Siap Membuat Kartu Anda?</h2>
          <p>Bergabunglah dengan ribuan pengguna lain yang sudah mencetak dokumen penting mereka dengan mudah.</p>
          <button className="btn btn-primary btn-large" onClick={() => navigate('/buat-kartu')}>
            Mulai Sekarang - Gratis
          </button>
        </div>
      </section>

    </div>
  );
}
