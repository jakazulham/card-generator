import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import ErrorNotification from '../components/ErrorNotification';

// =============================================================================
// Konstanta Template BPJS
// Template latar belakang kartu dari folder /assets/
// =============================================================================
const ASSETS = {
  front: '/assets/bpjs_front.png',
  back: '/assets/bpjs_back.png',
};

// =============================================================================
// Ukuran Kartu Standar ISO 7810 ID-1 (85.6 mm × 53.98 mm)
// =============================================================================
const CARD_SPEC = {
  widthMM: 85.6,
  heightMM: 53.98,
  pageHeightMM: 60,
};

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
// Halaman Generator Kartu BPJS
// =============================================================================
export default function BpjsGenerator() {
  // Form state
  const [formData, setFormData] = useState({
    cardNumber: '',
    name: '',
    address: '',
    birthDate: '',
    nik: '',
    faskes: '',
  });

  // UI state
  const [isFlipped, setIsFlipped] = useState(false);
  const [exportMode, setExportMode] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [lastExportType, setLastExportType] = useState(null);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Ref untuk hidden capture (html2canvas)
  const captureBackRef = useRef(null);

  // SEO
  useEffect(() => {
    document.title = 'Generate Kartu BPJS Online - CetakKartu.com';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Buat dan cetak kartu BPJS Kesehatan secara online, gratis, dan instan. Masukkan data peserta, dan unduh kartu BPJS dalam format PNG atau PDF siap cetak. Aman 100% tanpa upload data ke server.');
    }
    return () => {
      document.title = 'CetakKartu.com - Cetak Kartu Identitas Online';
      if (metaDesc) {
        metaDesc.setAttribute('content', 'Platform modern untuk membuat dan mencetak berbagai kartu identitas digital secara cepat, gratis, dan profesional.');
      }
    };
  }, []);

  // Input handler — with numeric-only validation for card number & NIK
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'cardNumber') {
      // Hanya digit, maksimal 13 karakter
      const cleaned = value.replace(/\D/g, '').slice(0, 13);
      setFormData(prev => ({ ...prev, cardNumber: cleaned }));
    } else if (name === 'nik') {
      // Hanya digit, maksimal 16 karakter
      const cleaned = value.replace(/\D/g, '').slice(0, 16);
      setFormData(prev => ({ ...prev, nik: cleaned }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Validasi
  const validateForm = () => {
    if (!formData.cardNumber.trim()) { alert('Nomor Kartu BPJS wajib diisi.'); return false; }
    if (formData.cardNumber.length < 11) { alert('Nomor Kartu BPJS minimal 11 digit.'); return false; }
    if (!formData.name.trim()) { alert('Nama lengkap wajib diisi.'); return false; }
    if (!formData.nik.trim()) { alert('NIK wajib diisi.'); return false; }
    if (formData.nik.length !== 16) { alert('NIK harus tepat 16 digit.'); return false; }
    return true;
  };

  // Helper: muat gambar
  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

  // =========================================================================
  // EKSPOR PNG
  // =========================================================================
  const handleExportPNG = async () => {
    if (!validateForm()) return;
    setIsExporting(true);
    setExportError(null);
    setLastExportType('png');

    try {
      setExportMode(true);
      await new Promise(resolve => setTimeout(resolve, 150));

      const backEl = captureBackRef.current;
      if (!backEl) throw new Error("Elemen pratinjau kartu tidak ditemukan.");

      const canvasOpts = { scale: 4, useCORS: true, allowTaint: true, backgroundColor: null, logging: false };
      const canvasOverlay = await html2canvas(backEl, canvasOpts);
      setExportMode(false);

      const triggerDownload = (dataUrl, fileName) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        link.click();
      };

      const sanitizedName = formData.name.trim().replace(/\s+/g, '_');

      // Sisi Depan
      const frontImg = await loadImage(ASSETS.front);
      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = frontImg.width;
      frontCanvas.height = frontImg.height;
      frontCanvas.getContext('2d').drawImage(frontImg, 0, 0);
      triggerDownload(frontCanvas.toDataURL('image/png'), `Kartu_BPJS_${sanitizedName}_Depan.png`);

      // Sisi Belakang — komposisi native background + overlay teks
      const backImg = await loadImage(ASSETS.back);
      const compCanvas = document.createElement('canvas');
      compCanvas.width = backImg.width;
      compCanvas.height = backImg.height;
      const ctx = compCanvas.getContext('2d');
      ctx.drawImage(backImg, 0, 0);
      ctx.drawImage(canvasOverlay, 0, 0, backImg.width, backImg.height);
      triggerDownload(compCanvas.toDataURL('image/png'), `Kartu_BPJS_${sanitizedName}_Belakang.png`);

    } catch (error) {
      console.error("PNG export error:", error);
      setExportError(error.message || "Gagal membuat gambar PNG kartu.");
      setExportMode(false);
    } finally {
      setIsExporting(false);
    }
  };

  // =========================================================================
  // EKSPOR PDF
  // =========================================================================
  const handleExportPDF = async () => {
    if (!validateForm()) return;
    setIsExporting(true);
    setExportError(null);
    setLastExportType('pdf');

    try {
      setExportMode(true);
      await new Promise(resolve => setTimeout(resolve, 150));

      const backEl = captureBackRef.current;
      if (!backEl) throw new Error("Elemen pratinjau kartu tidak ditemukan.");

      const canvasOpts = { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null, logging: false };
      const canvasOverlay = await html2canvas(backEl, canvasOpts);
      const overlayData = canvasOverlay.toDataURL('image/png');
      setExportMode(false);

      const { widthMM, heightMM, pageHeightMM } = CARD_SPEC;
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [widthMM, pageHeightMM] });

      // Halaman 1: Sisi Depan
      const frontImg = await loadImage(ASSETS.front);
      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = frontImg.width;
      frontCanvas.height = frontImg.height;
      frontCanvas.getContext('2d').drawImage(frontImg, 0, 0);
      pdf.addImage(frontCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, widthMM, heightMM);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Kartu ini dibuat di website: cetakkartu.com', widthMM / 2, pageHeightMM - 2, { align: 'center' });

      // Halaman 2: Sisi Belakang
      pdf.addPage([widthMM, pageHeightMM], 'landscape');
      const backImg = await loadImage(ASSETS.back);
      const backCanvas = document.createElement('canvas');
      backCanvas.width = backImg.width;
      backCanvas.height = backImg.height;
      backCanvas.getContext('2d').drawImage(backImg, 0, 0);
      pdf.addImage(backCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, widthMM, heightMM);
      pdf.addImage(overlayData, 'PNG', 0, 0, widthMM, heightMM);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Kartu ini dibuat di website: cetakkartu.com', widthMM / 2, pageHeightMM - 2, { align: 'center' });

      const sanitizedName = formData.name.trim().replace(/\s+/g, '_');
      pdf.save(`Kartu_BPJS_${sanitizedName}.pdf`);

    } catch (error) {
      console.error("PDF export error:", error);
      setExportError(error.message || "Gagal menyusun dokumen PDF kartu.");
      setExportMode(false);
    } finally {
      setIsExporting(false);
    }
  };

  // Retry export
  const handleRetryExport = () => {
    setExportError(null);
    if (lastExportType === 'png') handleExportPNG();
    else if (lastExportType === 'pdf') handleExportPDF();
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  return (
    <>
      <div className="bg-decorations">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>

      <div className="home-grid">
        {/* Panel Kiri — Form Input Data Peserta */}
        <section className="panel">
          <h2 className="panel-title">Data Peserta BPJS</h2>

          <form className="student-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="input-card-number">Nomor Kartu BPJS</label>
              <input
                id="input-card-number"
                name="cardNumber"
                type="text"
                inputMode="numeric"
                placeholder="Masukkan 11–13 digit nomor kartu BPJS"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
              <small className="admin-help">{formData.cardNumber.length}/13 digit (min 11)</small>
            </div>

            <div className="form-group">
              <label htmlFor="input-name">Nama Lengkap</label>
              <input
                id="input-name"
                name="name"
                type="text"
                placeholder="Masukkan nama lengkap peserta"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="input-nik">NIK</label>
              <input
                id="input-nik"
                name="nik"
                type="text"
                inputMode="numeric"
                placeholder="Masukkan 16 digit NIK"
                value={formData.nik}
                onChange={handleInputChange}
                required
              />
              <small className="admin-help">{formData.nik.length}/16 digit</small>
            </div>

            <div className="form-group">
              <label htmlFor="input-address">Alamat</label>
              <textarea
                id="input-address"
                name="address"
                placeholder="Masukkan alamat peserta"
                value={formData.address}
                onChange={handleInputChange}
                rows={2}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '0.95rem',
                  fontFamily: 'inherit',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-secondary)',
                  color: 'var(--text-primary)',
                  resize: 'vertical',
                  minHeight: '50px',
                  outline: 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                  lineHeight: '1.5',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.08)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-color)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="input-birth">Tanggal Lahir</label>
              <input
                id="input-birth"
                name="birthDate"
                type="date"
                value={formData.birthDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="input-faskes">Faskes Tingkat Pertama</label>
              <input
                id="input-faskes"
                name="faskes"
                type="text"
                placeholder="Masukkan nama faskes / puskesmas"
                value={formData.faskes}
                onChange={handleInputChange}
              />
            </div>
          </form>
        </section>

        {/* Panel Kanan — Preview Interaktif & Tombol Unduh */}
        <section className="preview-panel">
          {/* 3D Flip Card */}
          <div className="preview-container">
            <div className="card-3d-wrapper" onClick={() => setIsFlipped(prev => !prev)} title="Klik untuk membalik kartu">
              <div className={`card-3d-inner ${isFlipped ? 'flipped' : ''}`}>
                {/* Front */}
                <div className="card-face card-face-front bpjs-card-front">
                  <div className="card-content-front" />
                </div>
                {/* Back */}
                <div className="card-face card-face-back bpjs-card-back">
                  <div className="bpjs-card-content-back">
                    <div className="bpjs-details-table">
                      <span className="card-detail-label">Nomor Kartu</span>
                      <span className="card-detail-sep">:</span>
                      <span className="card-detail-value bpjs-card-number">{formData.cardNumber || '0000 0000 0000 0000'}</span>

                      <span className="card-detail-label">Nama</span>
                      <span className="card-detail-sep">:</span>
                      <span className="card-detail-value">{formData.name || 'NAMA PESERTA'}</span>

                      <span className="card-detail-label">Alamat</span>
                      <span className="card-detail-sep">:</span>
                      <span className="card-detail-value">{formData.address || 'ALAMAT PESERTA'}</span>

                      <span className="card-detail-label">Tanggal Lahir</span>
                      <span className="card-detail-sep">:</span>
                      <span className="card-detail-value">{formatDate(formData.birthDate)}</span>

                      <span className="card-detail-label">NIK</span>
                      <span className="card-detail-sep">:</span>
                      <span className="card-detail-value">{formData.nik || '0000 0000 0000 0000'}</span>

                      <span className="card-detail-label">Faskes</span>
                      <span className="card-detail-sep">:</span>
                      <span className="card-detail-value">{formData.faskes || 'FASKES TK. 1'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <span className="preview-hint">🔄 Klik kartu untuk melihat bagian belakang</span>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportPNG}
              disabled={isExporting || !formData.name || !formData.cardNumber}
              title="Unduh sisi depan dan belakang sebagai file gambar PNG terpisah"
            >
              📥 Unduh PNG
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExportPDF}
              disabled={isExporting || !formData.name || !formData.cardNumber}
              title="Unduh sisi depan dan belakang tergabung dalam satu file PDF standar ID Card (ISO 7810)"
            >
              {isExporting ? '⚙️ Memproses...' : '📄 Unduh PDF'}
            </button>
            <a
              href="https://s.shopee.co.id/70HoCvXDiX"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-orange"
              style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
              title="Cetak Fisik Berkualitas via Shopee"
            >
              🛒 Cetak Kartu
            </a>
          </div>
        </section>
      </div>

      {/* Cara Kerja */}
      <section className="steps-section" style={{ marginTop: '2rem' }}>
        <div className="section-header">
          <h2>Cara Kerja Sangat Mudah</h2>
          <p>Hanya dengan 3 langkah sederhana, kartu BPJS Anda siap dicetak.</p>
        </div>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Isi Data Peserta</h3>
            <p>Masukkan nomor kartu BPJS, nama, NIK, alamat, tanggal lahir, dan faskes pada form yang tersedia.</p>
          </div>
          <div className="step-line"></div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>Live Preview</h3>
            <p>Lihat pratinjau kartu secara real-time. Klik kartu untuk melihat bagian depan dan belakang sebelum diunduh.</p>
          </div>
          <div className="step-line"></div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Unduh & Cetak</h3>
            <p>Unduh kartu dalam format PNG resolusi tinggi atau PDF siap cetak dengan ukuran presisi standar ISO 7810 ID-1.</p>
          </div>
        </div>
      </section>

      {/* SEO & FAQ Section */}
      <section className="seo-section">
        <h2>Panduan Lengkap Kartu BPJS Kesehatan</h2>

        <div className="seo-article">
          <h3>Apa itu BPJS Kesehatan?</h3>
          <p>BPJS Kesehatan (Badan Penyelenggara Jaminan Sosial Kesehatan) adalah program jaminan kesehatan nasional yang diselenggarakan oleh pemerintah Indonesia. Setiap peserta diberikan Kartu BPJS Kesehatan yang berfungsi sebagai identitas resmi untuk mendapatkan pelayanan kesehatan di seluruh fasilitas kesehatan yang bekerjasama dengan BPJS.</p>
        </div>

        <div className="seo-article">
          <h3>Fungsi dan Manfaat Kartu BPJS</h3>
          <p>Kartu BPJS Kesehatan memiliki berbagai fungsi penting:</p>
          <ul>
            <li><strong>Akses Pelayanan Kesehatan:</strong> Digunakan untuk mendapatkan pelayanan di Puskesmas, Klinik, Rumah Sakit, dan Apotek yang bekerjasama dengan BPJS.</li>
            <li><strong>Identitas Peserta:</strong> Sebagai bukti resmi kepesertaan dalam program JKN (Jaminan Kesehatan Nasional).</li>
            <li><strong>Sistem Rujukan:</strong> Diperlukan dalam proses rujukan berjenjang dari Faskes Tingkat Pertama ke Fasilitas Kesehatan lanjutan.</li>
            <li><strong>Administrasi Klaim:</strong> Mempermudah proses administrasi dan klaim biaya pengobatan.</li>
          </ul>
        </div>

        <div className="seo-article">
          <h3>Tentang Generator Kartu BPJS Kami</h3>
          <p>Website <strong>Generator Kartu BPJS</strong> ini dirancang untuk membantu Anda membuat salinan digital Kartu BPJS Kesehatan dengan visual yang rapi dan presisi tinggi. Layanan ini 100% gratis, data diproses sepenuhnya di browser Anda tanpa diunggah ke server manapun, sehingga privasi dan keamanan data Anda terjamin.</p>
        </div>

        {/* FAQ */}
        <h3 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Tanya Jawab (FAQ)</h3>
        <div className="seo-accordion">
          {[
            { q: 'Apakah data yang saya masukkan aman?', a: 'Tentu saja. Tidak ada informasi apa pun yang dikirim dari perangkat Anda ke internet. Aplikasi ini beroperasi 100% menggunakan teknologi Client-Side Rendering, sehingga data Anda sepenuhnya tetap di dalam browser perangkat Anda saja.' },
            { q: 'Bagaimana cara mencetak kartu BPJS fisiknya?', a: 'Kami merekomendasikan penggunaan tombol <strong>Unduh PDF</strong>. Dokumen PDF dapat Anda bawa ke jasa cetak spesialis ID Card berbahan PVC atau dicetak menggunakan photo paper mengilap. Anda juga bisa langsung memesan cetak fisik melalui tombol <strong>Cetak Kartu</strong>.' },
            { q: 'Apakah kartu ini bisa digunakan sebagai pengganti kartu BPJS asli?', a: 'Kartu yang dihasilkan adalah salinan digital untuk keperluan pribadi dan cadangan. Untuk keperluan administrasi resmi di fasilitas kesehatan, kartu BPJS asli yang diterbitkan oleh BPJS Kesehatan tetap menjadi dokumen utama.' },
            { q: 'Berapa ukuran kartu BPJS yang benar?', a: 'Ukuran standar kartu BPJS sama dengan KTP yaitu <strong>85,6 mm × 53,98 mm</strong> (standar ISO 7810 ID-1). File PDF yang diunduh dari generator kami telah disesuaikan dengan standar tersebut sehingga siap cetak.' },
          ].map((item, idx) => (
            <div className="seo-accordion-item" key={idx}>
              <button
                className="seo-accordion-header"
                onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
              >
                {item.q}
                <span>{activeAccordion === idx ? '▲' : '▼'}</span>
              </button>
              {activeAccordion === idx && (
                <div className="seo-accordion-content">
                  <p dangerouslySetInnerHTML={{ __html: item.a }} />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Hidden Capture Container — untuk html2canvas (hanya overlay teks, background transparan) */}
      <div className="hidden-capture-container" aria-hidden="true">
        <div
          ref={captureBackRef}
          id="capture-bpjs-back"
          className="capture-target bpjs-capture-target"
          style={{ width: '640px', height: '404px', position: 'relative', overflow: 'hidden' }}
        >
          <div className={exportMode ? '' : 'bpjs-card-back'} style={{ width: '100%', height: '100%' }}>
            <div className="bpjs-card-content-back">
              <div className="bpjs-details-table">
                <span className="card-detail-label">Nomor Kartu</span>
                <span className="card-detail-sep">:</span>
                <span className="card-detail-value bpjs-card-number">{formData.cardNumber || '0000 0000 0000 0000'}</span>

                <span className="card-detail-label">Nama</span>
                <span className="card-detail-sep">:</span>
                <span className="card-detail-value">{formData.name || 'NAMA PESERTA'}</span>

                <span className="card-detail-label">Alamat</span>
                <span className="card-detail-sep">:</span>
                <span className="card-detail-value">{formData.address || 'ALAMAT PESERTA'}</span>

                <span className="card-detail-label">Tanggal Lahir</span>
                <span className="card-detail-sep">:</span>
                <span className="card-detail-value">{formatDate(formData.birthDate)}</span>

                <span className="card-detail-label">NIK</span>
                <span className="card-detail-sep">:</span>
                <span className="card-detail-value">{formData.nik || '0000 0000 0000 0000'}</span>

                <span className="card-detail-label">Faskes</span>
                <span className="card-detail-sep">:</span>
                <span className="card-detail-value">{formData.faskes || 'FASKES TK. 1'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Notification */}
      <ErrorNotification
        message={exportError}
        onClose={() => setExportError(null)}
        onRetry={handleRetryExport}
      />
    </>
  );
}
