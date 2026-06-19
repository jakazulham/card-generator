import React from 'react';
import { Link } from 'react-router-dom';

export default function Disclaimer() {
  return (
    <div className="page-container" style={{ padding: '2rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div className="disclaimer-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="responsive-page-title">
          Disclaimer & Ketentuan Layanan
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Harap baca dengan teliti sebelum menggunakan layanan CetakKartu.com. Dengan menggunakan situs ini, Anda dianggap telah memahami dan menyetujui seluruh ketentuan di bawah ini.
        </p>
      </div>

      <div className="silhouette-container" style={{ marginBottom: '4rem', perspective: '1000px' }}>
        <svg 
          width="320" 
          height="200" 
          viewBox="0 0 320 200" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: 'rotateY(15deg) rotateX(10deg)',
            filter: 'drop-shadow(0 25px 30px rgba(0,0,0,0.15))',
            transition: 'transform 0.5s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'rotateY(15deg) rotateX(10deg)'}
        >
          {/* Card Base */}
          <rect width="320" height="200" rx="16" fill="url(#grad1)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
          {/* Silhouette Elements */}
          <rect x="24" y="24" width="40" height="40" rx="20" fill="rgba(255,255,255,0.2)"/>
          <rect x="80" y="32" width="120" height="12" rx="6" fill="rgba(255,255,255,0.3)"/>
          <rect x="80" y="52" width="80" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
          
          <rect x="24" y="90" width="70" height="85" rx="8" fill="rgba(255,255,255,0.2)"/>
          
          <rect x="110" y="100" width="160" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
          <rect x="110" y="120" width="130" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
          <rect x="110" y="140" width="180" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
          <rect x="110" y="160" width="100" height="8" rx="4" fill="rgba(255,255,255,0.2)"/>
          
          <defs>
            <linearGradient id="grad1" x1="0" y1="0" x2="320" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="var(--accent, #3b82f6)" />
              <stop offset="1" stopColor="#1e3a8a" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      
      <div className="glass-card" style={{ 
        maxWidth: '900px', 
        width: '100%', 
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '3rem',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)'
      }}>
        
        <div style={{ background: 'rgba(239, 68, 68, 0.08)', borderLeft: '4px solid #ef4444', padding: '1.5rem', borderRadius: '8px', marginBottom: '2.5rem' }}>
          <h3 style={{ color: '#ef4444', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.25rem' }}>
            <span>⚠️</span> Status Independen & Non-Afiliasi
          </h3>
          <p style={{ lineHeight: '1.7', fontSize: '1rem', color: 'var(--text-secondary)' }}>
            <strong>CetakKartu.com</strong> beserta seluruh layanan generator kartu di dalamnya (termasuk Kartu NISN, Kartu Pelajar, BPJS, NUPTK, KIP, PIP, dan NRG) adalah <strong>platform pihak ketiga yang sepenuhnya independen</strong>. Kami sama sekali TIDAK berafiliasi, disponsori, didukung, maupun terkait dengan Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi (Kemendikbudristek), BPJS Kesehatan, maupun instansi pemerintah atau lembaga resmi mana pun.
          </p>
        </div>

        <div className="disclaimer-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          
          <section>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>1. Tujuan Penggunaan Platform</h3>
            <p>Platform ini disediakan semata-mata sebagai alat bantu digital (<em>tools</em>) untuk mempermudah proses desain dan pencetakan fisik kartu identitas secara mandiri. Kami menyediakan <em>template</em> dan antarmuka <em>mockup</em> untuk keperluan edukasi, simulasi, administrasi internal sekolah, dan kemudahan pencetakan pribadi. Kartu yang dihasilkan dari platform ini bukanlah dokumen negara dan tidak memiliki kekuatan hukum layaknya dokumen yang diterbitkan oleh institusi resmi.</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>2. Tanggung Jawab Pengguna (End-User Liability)</h3>
            <p>Sebagai pengguna, Anda setuju untuk memikul tanggung jawab penuh secara hukum atas setiap dan seluruh data yang Anda masukkan ke dalam platform ini. Anda dilarang keras menggunakan layanan ini untuk:</p>
            <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>Memalsukan identitas individu lain tanpa izin.</li>
              <li>Mencetak dokumen identitas palsu untuk tujuan penipuan, tindak kejahatan, atau melanggar hukum yang berlaku di Negara Kesatuan Republik Indonesia.</li>
              <li>Mengubah data asli yang seharusnya valid dari <em>database</em> kementerian demi kepentingan pribadi.</li>
            </ul>
            <p style={{ marginTop: '0.5rem' }}>Pengembang aplikasi <strong>dibebaskan dari segala tuntutan hukum (Hold Harmless)</strong> yang diakibatkan oleh kelalaian atau kesengajaan pengguna dalam menyalahgunakan hasil cetakan dari website ini.</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>3. Privasi & Pemrosesan Data Klien (Client-Side)</h3>
            <p>Sistem kami dirancang dengan prinsip <em>Privacy by Design</em>. Seluruh pemrosesan teks, penggabungan gambar, dan pembentukan file unduhan (PDF/PNG) dilakukan 100% di dalam <em>browser</em> perangkat Anda (<em>Client-Side Rendering</em>). <strong>Kami tidak mengumpulkan, mentransmisikan, menyimpan, apalagi menjual data pribadi apa pun (seperti Nama, NISN, Tempat Lahir) ke <em>server</em> kami atau kepada pihak ketiga.</strong> Segala bentuk informasi yang Anda ketik akan hilang dari perangkat Anda seketika setelah halaman dimuat ulang (<em>refresh</em>) atau ditutup.</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>4. Akurasi & Ketersediaan Layanan</h3>
            <p>Meskipun kami berupaya keras memberikan <em>template</em> yang presisi dan berkualitas tinggi, kami tidak memberikan jaminan eksplisit maupun implisit (<em>No Warranty</em>) bahwa layanan ini akan selalu bebas dari <em>error</em>, interupsi, atau ketidaksempurnaan desain. Akses ke platform ini diberikan "sebagaimana adanya" (<em>As Is</em>).</p>
          </section>

          <section>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '1rem' }}>5. Perubahan Ketentuan</h3>
            <p>Pihak CetakKartu.com berhak untuk memodifikasi, menambah, atau menghapus bagian mana pun dari halaman Penafian ini kapan saja tanpa pemberitahuan sebelumnya. Merupakan tanggung jawab Anda untuk secara berkala memeriksa halaman ini guna mengetahui perubahan yang ada.</p>
          </section>

        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: '3rem', padding: '2.5rem', background: 'var(--bg-secondary)', borderRadius: '24px', border: '1px solid var(--border-color)', maxWidth: '900px', width: '100%' }}>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '1.4rem', marginBottom: '0.75rem' }}>Siap Membuat Kartu NISN?</h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1rem' }}>Buat kartu NISN Anda sekarang — gratis, cepat, dan tanpa perlu keahlian desain.</p>
        <Link to="/nisn" style={{ display: 'inline-block', background: 'var(--accent)', color: 'white', padding: '0.85rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 600, fontSize: '1rem', transition: 'transform 0.2s' }}>Buat Kartu NISN Sekarang →</Link>
      </div>
    </div>
  );
}
