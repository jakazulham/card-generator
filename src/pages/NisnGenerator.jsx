import React, { useState, useRef, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import CardPreview, { CardFront, CardBack } from '../components/CardPreview';
import ErrorNotification from '../components/ErrorNotification';

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

export default function App() {
  // Theme State
  const [theme, setTheme] = useState('light');

  // Student Form State
  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    birthPlace: '',
    birthDate: '',
    gender: 'Laki-laki'
  });

  // Validation Error State
  const [validationError, setValidationError] = useState('');

  // UI Control State
  const [templateId, setTemplateId] = useState(1);
  const [isFlipped, setIsFlipped] = useState(false);
  const [exportMode, setExportMode] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Export State
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState(null);
  const [lastExportType, setLastExportType] = useState(null); // 'png' or 'pdf'

  // Refs for hidden captures
  const captureFrontRef = useRef(null);
  const captureBackRef = useRef(null);

  // Apply Theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Toggle Theme
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Form Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'nisn') {
      // 1. Only allow digits (0-9)
      const cleanedValue = value.replace(/\D/g, '');
      // 2. Max 10 digits
      const limitedValue = cleanedValue.slice(0, 10);

      setFormData(prev => ({
        ...prev,
        [name]: limitedValue
      }));

      // Validate length dynamically
      if (limitedValue.length > 0 && limitedValue.length < 10) {
        setValidationError('NISN harus terdiri dari tepat 10 angka.');
      } else {
        setValidationError('');
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Form Submission/Export Validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      alert('Nama lengkap wajib diisi.');
      return false;
    }
    if (!formData.nisn) {
      setValidationError('NISN wajib diisi.');
      return false;
    }
    if (formData.nisn.length !== 10) {
      setValidationError('NISN harus terdiri dari tepat 10 angka.');
      return false;
    }
    if (!formData.birthPlace.trim()) {
      alert('Tempat lahir wajib diisi.');
      return false;
    }
    if (!formData.birthDate) {
      alert('Tanggal lahir wajib diisi.');
      return false;
    }
    return true;
  };

  // Helper to load image for native composition
  const loadImage = (src) => new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });

  // Export to PNG Image (Native Quality Composition)
  const handleExportPNG = async () => {
    if (!validateForm()) return;
    setIsExporting(true);
    setExportError(null);
    setLastExportType('png');

    try {
      setExportMode(true);
      await new Promise(resolve => setTimeout(resolve, 150)); // Wait for transparent background

      const backEl = captureBackRef.current;
      if (!backEl) throw new Error("Elemen pratinjau kartu tidak ditemukan.");

      const canvasOpts = { scale: 4, useCORS: true, allowTaint: true, backgroundColor: null, logging: false };
      const canvasOverlay = await html2canvas(backEl, canvasOpts);
      setExportMode(false); // Restore background

      const triggerDownload = (dataUrl, fileName) => {
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = fileName;
        link.click();
      };

      const sanitizedName = formData.name.trim().replace(/\s+/g, '_');

      // 1. Download Front (Native size, direct from asset)
      const frontSrc = `/assets/template_front_${templateId}.png`;
      const frontImg = await loadImage(frontSrc);
      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = frontImg.width;
      frontCanvas.height = frontImg.height;
      frontCanvas.getContext('2d').drawImage(frontImg, 0, 0);
      triggerDownload(frontCanvas.toDataURL('image/png'), `Kartu_NISN_${sanitizedName}_Depan.png`);

      // 2. Download Back (Compose Native background + scaled text overlay)
      const backSrc = `/assets/template_back_${templateId}.png`;
      const backImg = await loadImage(backSrc);
      const compCanvas = document.createElement('canvas');
      compCanvas.width = backImg.width;
      compCanvas.height = backImg.height;
      const ctx = compCanvas.getContext('2d');
      ctx.drawImage(backImg, 0, 0);
      // Draw text overlay stretched to fill the native background exactly
      ctx.drawImage(canvasOverlay, 0, 0, backImg.width, backImg.height);
      triggerDownload(compCanvas.toDataURL('image/png'), `Kartu_NISN_${sanitizedName}_Belakang.png`);

    } catch (error) {
      console.error("PNG export error:", error);
      setExportError(error.message || "Gagal membuat gambar PNG kartu.");
      setExportMode(false);
    } finally {
      setIsExporting(false);
    }
  };

  // Export to PDF Document (Native Quality Composition)
  const handleExportPDF = async () => {
    if (!validateForm()) return;
    setIsExporting(true);
    setExportError(null);
    setLastExportType('pdf');

    try {
      setExportMode(true);
      await new Promise(resolve => setTimeout(resolve, 150)); // Wait for transparent background

      const backEl = captureBackRef.current;
      if (!backEl) throw new Error("Elemen pratinjau kartu tidak ditemukan.");

      const canvasOpts = { scale: 2, useCORS: true, allowTaint: true, backgroundColor: null, logging: false };
      const canvasOverlay = await html2canvas(backEl, canvasOpts);
      const overlayData = canvasOverlay.toDataURL('image/png');
      setExportMode(false); // Restore background

      // Increase height slightly to 60mm to make room for the text at the bottom
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 60] });

      // Page 1: Native Front Image (JPEG for smaller file size, high quality)
      const frontSrc = `/assets/template_front_${templateId}.png`;
      const frontImg = await loadImage(frontSrc);
      const frontCanvas = document.createElement('canvas');
      frontCanvas.width = frontImg.width;
      frontCanvas.height = frontImg.height;
      frontCanvas.getContext('2d').drawImage(frontImg, 0, 0);
      pdf.addImage(frontCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 85.6, 53.98);
      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Kartu ini dibuat diwebsite: cetakkartu.com', 42.8, 58, { align: 'center' });

      // Page 2: Native Back Image + Text Overlay
      pdf.addPage([85.6, 53.98], 'landscape');
      const backSrc = `/assets/template_back_${templateId}.png`;
      const backImg = await loadImage(backSrc);
      const backCanvas = document.createElement('canvas');
      backCanvas.width = backImg.width;
      backCanvas.height = backImg.height;
      const backCtx = backCanvas.getContext('2d');
      backCtx.drawImage(backImg, 0, 0);

      pdf.addImage(backCanvas.toDataURL('image/jpeg', 0.95), 'JPEG', 0, 0, 85.6, 53.98);
      pdf.addImage(overlayData, 'PNG', 0, 0, 85.6, 53.98);

      pdf.setFontSize(8);
      pdf.setTextColor(100, 100, 100);
      pdf.text('Kartu ini dibuat diwebsite: cetakkartu.com', 42.8, 58, { align: 'center' });

      const sanitizedName = formData.name.trim().replace(/\s+/g, '_');
      pdf.save(`Kartu_NISN_${sanitizedName}.pdf`);

    } catch (error) {
      console.error("PDF export error:", error);
      setExportError(error.message || "Gagal menyusun dokumen PDF kartu.");
      setExportMode(false);
    } finally {
      setIsExporting(false);
    }
  };

  // Retry the last failed export
  const handleRetryExport = () => {
    setExportError(null);
    if (lastExportType === 'png') {
      handleExportPNG();
    } else if (lastExportType === 'pdf') {
      handleExportPDF();
    }
  };

  // Get current template back face style class
  const getTemplateClass = (side) => {
    if (templateId === 1) return side === 'front' ? 'card-m1-front' : 'card-m1-back';
    if (templateId === 2) return side === 'front' ? 'card-m2-front' : 'card-m2-back';
    if (templateId === 3) return side === 'front' ? 'card-m3-front' : 'card-m3-back';
    return '';
  };

  return (
    <>
      <div className="bg-decorations">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
      </div>


      <div className="home-grid">
        {/* Left Side Panel - Input Form & Options */}
        <section className="panel">
          <h2 className="panel-title">Data Siswa</h2>

          <form className="student-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label htmlFor="input-name">Nama Lengkap</label>
              <input
                id="input-name"
                name="name"
                type="text"
                placeholder="Masukkan nama lengkap siswa"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="input-nisn">Nomor NISN</label>
              <input
                id="input-nisn"
                name="nisn"
                type="text"
                placeholder="Masukkan 10 digit NISN"
                className={validationError ? 'error' : ''}
                value={formData.nisn}
                onChange={handleInputChange}
                required
              />
              {validationError && (
                <span className="error-text">{validationError}</span>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label htmlFor="input-place">Tempat Lahir</label>
                <input
                  id="input-place"
                  name="birthPlace"
                  type="text"
                  placeholder="Tempat lahir"
                  value={formData.birthPlace}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="input-date">Tanggal Lahir</label>
                <input
                  id="input-date"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Jenis Kelamin</label>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Laki-laki"
                    checked={formData.gender === 'Laki-laki'}
                    onChange={handleInputChange}
                  />
                  Laki-laki
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="gender"
                    value="Perempuan"
                    checked={formData.gender === 'Perempuan'}
                    onChange={handleInputChange}
                  />
                  Perempuan
                </label>
              </div>
            </div>

            <div className="form-group" style={{ marginTop: '0.5rem' }}>
              <label>Pilih Template Kartu</label>
              <div className="template-grid" role="radiogroup" aria-label="Template kartu">
                <div
                  className={`template-option template-option-1 ${templateId === 1 ? 'selected' : ''}`}
                  onClick={() => setTemplateId(1)}
                  role="radio"
                  aria-checked={templateId === 1}
                  tabIndex={0}
                  title="Template Classic"
                />
                <div
                  className={`template-option template-option-2 ${templateId === 2 ? 'selected' : ''}`}
                  onClick={() => setTemplateId(2)}
                  role="radio"
                  aria-checked={templateId === 2}
                  tabIndex={0}
                  title="Template Modern 1"
                />
                <div
                  className={`template-option template-option-3 ${templateId === 3 ? 'selected' : ''}`}
                  onClick={() => setTemplateId(3)}
                  role="radio"
                  aria-checked={templateId === 3}
                  tabIndex={0}
                  title="Template Modern 3"
                />
              </div>
            </div>
          </form>
        </section>

        {/* Right Side Panel - Interactive Preview & Download actions */}
        <section className="preview-panel">
          <CardPreview
            data={formData}
            templateId={templateId}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(prev => !prev)}
          />

          <div className="action-buttons">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleExportPNG}
              disabled={isExporting || !!validationError || !formData.name || !formData.nisn}
              title="Unduh sisi depan dan belakang sebagai file gambar PNG terpisah"
            >
              📥 Unduh PNG
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExportPDF}
              disabled={isExporting || !!validationError || !formData.name || !formData.nisn}
              title="Unduh sisi depan dan belakang tergabung dalam satu file PDF standar ID Card"
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

      {/* SEO Content Section */}
      <section className="seo-section">
        <h2>Panduan Lengkap NISN Nasional</h2>

        <div className="seo-article">
          <h3>Apa itu NISN?</h3>
          <p>Nomor Induk Siswa Nasional (NISN) adalah kode identitas pengenal siswa yang bersifat unik, standar, dan berlaku sepanjang masa. NISN digunakan untuk mengidentifikasi setiap individu siswa yang bersekolah di seluruh Indonesia pada jenjang pendidikan dasar dan menengah, serta program kesetaraan di bawah naungan Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek) maupun Kementerian Agama (Kemenag).</p>
        </div>

        <div className="seo-article">
          <h3>Fungsi dan Manfaat Utama NISN</h3>
          <p>NISN tidak sekadar nomor acak, melainkan kunci akses penting dalam sistem pendidikan nasional. Fungsi utamanya antara lain:</p>
          <ul>
            <li><strong>Syarat Ujian dan Kelulusan:</strong> Mutlak diperlukan untuk mendaftar Ujian Nasional (walau sudah ditiadakan, diganti asesmen lain), ujian sekolah, hingga proses kelulusan.</li>
            <li><strong>Seleksi Masuk Perguruan Tinggi:</strong> Sangat penting untuk mendaftar SNMPTN, SBMPTN (SNBP/SNBT), atau seleksi masuk kampus lainnya.</li>
            <li><strong>Bantuan Pendidikan:</strong> Digunakan sebagai basis pencairan dana Bantuan Operasional Sekolah (BOS) dan Program Indonesia Pintar (PIP).</li>
            <li><strong>Pangkalan Data:</strong> Memastikan data siswa terhubung langsung secara nasional melalui DAPODIK (Data Pokok Pendidikan).</li>
          </ul>
        </div>

        <div className="seo-article">
          <h3>Apakah Nomor NISN Bisa Berubah?</h3>
          <p>Pada dasarnya, NISN dirancang untuk bersifat permanen. Artinya, satu siswa hanya akan memiliki satu NISN seumur hidupnya semenjak pertama kali diterbitkan di tingkat Sekolah Dasar (SD) atau sederajat. Jika terdapat perubahan sekolah, mutasi, atau pindah jenjang (SD ke SMP ke SMA), nomor NISN akan tetap sama. Perubahan nomor hanya terjadi jika terdeteksi adanya "NISN Ganda" akibat kesalahan input sistem di masa lalu.</p>
        </div>

        <div className="seo-article">
          <h3>Cara Cek & Sinkronisasi Data NISN di DAPODIK</h3>
          <p>Data NISN secara otomatis tersinkronisasi melalui aplikasi DAPODIK yang dikelola oleh operator masing-masing sekolah. Untuk memastikan data Anda benar, Anda bisa memeriksanya melalui portal resmi referensi data Kemendikbud. Jika ternyata terdapat ketidaksesuaian data (misalnya nama ibu kandung salah atau tempat lahir keliru), Anda wajib melaporkannya kepada operator sekolah asal. Operator sekolah akan mengajukan perbaikan melalui platform VervalPD (Verifikasi dan Validasi Peserta Didik).</p>
        </div>

        <div className="seo-article">
          <h3>Tentang Aplikasi NISN Generator Kami</h3>
          <p>Website <strong>Generator Kartu NISN</strong> ini dirancang untuk menyediakan sarana simulasi desain pembuatan Kartu NISN dengan visual yang estetik dan presisi tinggi. Seringkali, mencetak kartu secara manual membutuhkan keahlian desain grafis, sehingga layanan ini hadir untuk meniadakan hambatan teknis tersebut. Anda dapat memasukkan data secara *real-time* dan langsung mengunduh hasil dokumen siap cetaknya.</p>
        </div>

        {/* FAQ - Using Accordion */}
        <h3 style={{ color: 'var(--primary-color)', textAlign: 'center', marginBottom: '1.5rem', fontSize: '1.4rem' }}>Tanya Jawab Seputar Aplikasi (FAQ)</h3>
        <div className="seo-accordion">
          <div className="seo-accordion-item">
            <button
              className="seo-accordion-header"
              onClick={() => setActiveAccordion(activeAccordion === 0 ? null : 0)}
            >
              Apakah data yang saya masukkan aman?
              <span>{activeAccordion === 0 ? '▲' : '▼'}</span>
            </button>
            {activeAccordion === 0 && (
              <div className="seo-accordion-content">
                <p>Tentu saja. Tidak ada informasi apa pun yang dikirim dari perangkat Anda ke internet. Aplikasi ini beroperasi 100% menggunakan teknologi pengolahan sisi klien (Client-Side Rendering), sehingga data NISN, Nama, dan Tanggal Lahir Anda sepenuhnya tetap di dalam browser perangkat Anda saja.</p>
              </div>
            )}
          </div>

          <div className="seo-accordion-item">
            <button
              className="seo-accordion-header"
              onClick={() => setActiveAccordion(activeAccordion === 1 ? null : 1)}
            >
              Bagaimana cara terbaik untuk mencetak kartu fisiknya?
              <span>{activeAccordion === 1 ? '▲' : '▼'}</span>
            </button>
            {activeAccordion === 1 && (
              <div className="seo-accordion-content">
                <p>Kami sangat merekomendasikan penggunaan tombol <strong>Unduh PDF</strong>. Algoritma kami menggabungkan *overlay* teks di atas lapisan gambar resolusi tinggi tanpa kompresi blur berlebihan. Dokumen PDF ini dapat Anda bawa ke jasa cetak spesialis ID Card (berbahan PVC murni) atau diprint menggunakan photo paper mengilap, atau bisa dengan mudah cetak dengan menekan tombol cetak kartu diatas.</p>
              </div>
            )}
          </div>

          <div className="seo-accordion-item">
            <button
              className="seo-accordion-header"
              onClick={() => setActiveAccordion(activeAccordion === 2 ? null : 2)}
            >
              Apa Perbedaan NISN dan NPSN?
              <span>{activeAccordion === 2 ? '▲' : '▼'}</span>
            </button>
            {activeAccordion === 2 && (
              <div className="seo-accordion-content">
                <p><strong>NISN (Nomor Induk Siswa Nasional)</strong> adalah kode unik yang diberikan kepada setiap siswa sebagai identitas individu yang berlaku seumur hidup. Sedangkan <strong>NPSN (Nomor Pokok Sekolah Nasional)</strong> adalah kode unik yang diberikan kepada satuan pendidikan (sekolah) sebagai identitas resmi institusi tersebut. Keduanya merupakan bagian integral dari sistem Data Pokok Pendidikan (Dapodik).</p>
              </div>
            )}
          </div>

          <div className="seo-accordion-item">
            <button
              className="seo-accordion-header"
              onClick={() => setActiveAccordion(activeAccordion === 3 ? null : 3)}
            >
              Bagaimana cara mengatasi NISN ganda?
              <span>{activeAccordion === 3 ? '▲' : '▼'}</span>
            </button>
            {activeAccordion === 3 && (
              <div className="seo-accordion-content">
                <p>Jika Anda memiliki lebih dari satu NISN (NISN ganda), hal ini biasanya terjadi karena sistem lama atau mutasi sekolah. Anda harus melapor ke operator sekolah Anda saat ini dengan membawa dokumen pendukung (Akte Kelahiran / Kartu Keluarga). Operator akan melakukan pengajuan "Merger NISN" atau penghapusan salah satu NISN melalui portal VervalPD (Verifikasi dan Validasi Peserta Didik) agar hanya tersisa satu NISN yang aktif dan valid.</p>
              </div>
            )}
          </div>

          <div className="seo-accordion-item">
            <button
              className="seo-accordion-header"
              onClick={() => setActiveAccordion(activeAccordion === 4 ? null : 4)}
            >
              Bagaimana cara memperbaiki data NISN yang salah (nama/tanggal lahir)?
              <span>{activeAccordion === 4 ? '▲' : '▼'}</span>
            </button>
            {activeAccordion === 4 && (
              <div className="seo-accordion-content">
                <p>Semua perubahan data identitas siswa, seperti perbaikan ejaan nama, jenis kelamin, maupun tanggal lahir yang tidak sesuai, <strong>tidak bisa diubah sendiri oleh siswa</strong>. Siswa/wali murid harus menyerahkan berkas resmi terbaru yang benar (seperti Akta Kelahiran atau Kartu Keluarga) ke bagian Tata Usaha atau Operator Sekolah tempat siswa bersekolah. Operator yang akan mengeksekusi sinkronisasi pembaruan tersebut di Dapodik.</p>
              </div>
            )}
          </div>

          <div className="seo-accordion-item">
            <button
              className="seo-accordion-header"
              onClick={() => setActiveAccordion(activeAccordion === 5 ? null : 5)}
            >
              Apakah NISN wajib untuk pendaftaran PPDB dan Kuliah?
              <span>{activeAccordion === 5 ? '▲' : '▼'}</span>
            </button>
            {activeAccordion === 5 && (
              <div className="seo-accordion-content">
                <p><strong>Sangat Wajib.</strong> NISN menjadi syarat mutlak dalam proses Penerimaan Peserta Didik Baru (PPDB) di semua jenjang (SD ke SMP, SMP ke SMA/SMK). Selain itu, untuk jalur seleksi masuk Perguruan Tinggi Negeri seperti SNBP (jalur prestasi) dan SNBT (jalur tes), siswa harus memiliki NISN yang aktif dan datanya sesuai dengan pusat data kementerian.</p>
              </div>
            )}
          </div>

          <div className="seo-accordion-item">
            <button
              className="seo-accordion-header"
              onClick={() => setActiveAccordion(activeAccordion === 6 ? null : 6)}
            >
              Berapa ukuran kartu NISN yang benar untuk dicetak?
              <span>{activeAccordion === 6 ? '▲' : '▼'}</span>
            </button>
            {activeAccordion === 6 && (
              <div className="seo-accordion-content">
                <p>Ukuran standar untuk mencetak kartu identitas pelajar atau kartu NISN umumnya setara dengan ukuran kartu KTP, kartu kredit, atau kartu ATM, yaitu berdimensi <strong>85,6 mm × 53,98 mm</strong> (standar ISO 7810 ID-1). Jika Anda mengunduh file PDF dari generator kami, ukurannya telah disesuaikan dengan standar tersebut sehingga siap cetak (termasuk bleed area jika diperlukan).</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* --- Hidden DOM elements for html2canvas clean captures (No perspective distortion) --- */}
      <div className="hidden-capture-container" aria-hidden="true">
        {/* FRONT CAPTURE TARGET */}
        <div
          ref={captureFrontRef}
          id="capture-front"
          className="capture-target"
          style={{ width: '640px', height: '404px', position: 'relative', overflow: 'hidden' }}
        >
          <CardFront templateId={templateId} />
        </div>

        {/* BACK CAPTURE TARGET */}
        <div
          ref={captureBackRef}
          id="capture-back"
          className="capture-target"
          style={{ width: '640px', height: '404px', position: 'relative', overflow: 'hidden' }}
        >
          <CardBack templateId={templateId} data={formData} exportMode={exportMode} />
        </div>
      </div>

      {/* Error Popup Notification */}
      <ErrorNotification
        message={exportError}
        onClose={() => setExportError(null)}
        onRetry={handleRetryExport}
      />
    </>
  );
}
