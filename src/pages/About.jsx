import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="page-container" style={{ padding: '2rem 2rem 4rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div className="about-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="responsive-page-title">
          Tentang Kami
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Misi kami adalah memberikan kemudahan bagi ekosistem pendidikan di Indonesia dengan menyediakan alat bantu digital (tools) yang gratis, cepat, dan aman.
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
            transform: 'rotateY(-15deg) rotateX(10deg)',
            filter: 'drop-shadow(0 25px 30px rgba(0,0,0,0.15))',
            transition: 'transform 0.5s ease',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'rotateY(0deg) rotateX(0deg)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'rotateY(-15deg) rotateX(10deg)'}
        >
          {/* Card Base */}
          <rect width="320" height="200" rx="16" fill="url(#grad2)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
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
            <linearGradient id="grad2" x1="0" y1="0" x2="320" y2="200" gradientUnits="userSpaceOnUse">
              <stop stopColor="#8b5cf6" />
              <stop offset="1" stopColor="#4c1d95" />
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
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
          
          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', fontSize: '1.8rem', textAlign: 'center' }}>
            Mendukung Administrasi Pendidikan
          </h2>
          
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            <strong>CetakKartu.com</strong> adalah sebuah platform web inovatif yang dirancang secara khusus untuk membantu ekosistem pendidikan di Indonesia. Platform ini hadir sebagai solusi praktis bagi para siswa, guru, operator sekolah, dan wali murid dalam memproses pembuatan desain pratinjau Kartu Nomor Induk Siswa Nasional (NISN) secara cepat, berstandar nasional, dan sangat ramah pengguna. 
          </p>

          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Kami menyadari bahwa kartu identitas seperti NISN memegang peranan yang sangat vital. Kartu ini berfungsi sebagai persyaratan utama dalam berbagai keperluan resmi, mulai dari pendaftaran ujian, seleksi masuk jenjang pendidikan baru (PPDB), pengajuan beasiswa, pendaftaran kuliah, hingga sinkronisasi data operasional. Sayangnya, proses pembuatan *mockup* kartu secara mandiri seringkali terkendala oleh kurangnya keahlian desain atau mahalnya aplikasi desain grafis profesional.
          </p>

          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Berangkat dari tantangan tersebut, kami mendirikan platform ini dan memberikan <strong>akses gratis sepenuhnya</strong> bagi masyarakat Indonesia. Dengan memanfaatkan platform ini, Anda tidak perlu lagi memiliki keahlian teknis khusus; cukup masukkan data, dan kartu yang rapi nan presisi pun siap untuk diunduh.
          </p>

          <div style={{ 
            background: 'var(--bg-primary)', 
            borderLeft: '4px solid var(--accent, #3b82f6)', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            margin: '3rem 0',
            border: '1px solid var(--border-color)',
            borderLeftWidth: '4px'
          }}>
            <h3 style={{ margin: '0 0 1rem 0', color: 'var(--text-primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              ℹ️ Verifikasi Data Resmi
            </h3>
            <p style={{ margin: '0 0 1rem 0', fontSize: '1rem', lineHeight: '1.6' }}>
              Sebagai platform independen, CetakKartu.com berfungsi sebagai alat bantu simulasi visual (desainer *mockup*). Pastikan Anda selalu memverifikasi keakuratan dan keaktifan data nomor induk (NISN) sebelum mencetak kartu. Anda dapat melakukan pengecekan resmi melalui tautan-tautan pemerintah di bawah ini:
            </p>
            <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0, fontSize: '0.95rem', lineHeight: '1.8', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <a href="https://nisn.data.kemdikbud.go.id/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent, #3b82f6)', textDecoration: 'none', fontWeight: '600' }}>
                  Portal NISN Kemdikbud
                </a>
              </li>
              <li>
                <a href="https://nisn.data.kemendikdasmen.go.id/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent, #3b82f6)', textDecoration: 'none', fontWeight: '600' }}>
                  Portal NISN Baru (Kemendikdasmen)
                </a>
              </li>
              <li>
                <a href="https://ult.kemendikdasmen.go.id/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent, #3b82f6)', textDecoration: 'none', fontWeight: '600' }}>
                  Unit Layanan Terpadu
                </a>
              </li>
            </ul>
          </div>

          <h2 style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', marginTop: '3rem', fontSize: '1.6rem', textAlign: 'center' }}>
            Teknologi & Keamanan Privasi Data
          </h2>

          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>
            Privasi data anak dan siswa Anda adalah prioritas absolut kami. Aplikasi web ini dibangun menggunakan teknologi rendering modern berbasis klien (*Client-Side Processing*). Artinya, seluruh proses—mulai dari Anda mengetik teks, pembuatan kode batang (*QR Code*), hingga penggabungan gambar akhir—terjadi secara instan di dalam memori browser komputer atau smartphone Anda sendiri.
          </p>

          <p style={{ fontSize: '1.1rem', marginBottom: '3rem' }}>
            <strong>Kami tidak pernah mengunggah, merekam, atau membagikan data identitas Anda ke *server* mana pun di internet.</strong> Seketika Anda menutup jendela (*tab*) ini atau memuat ulang halaman, semua data Anda akan terhapus. Hal ini menjamin keamanan informasi Anda dari risiko pencurian data (*data breach*).
          </p>

          <hr style={{ border: 'none', borderTop: '1px solid var(--border-color)', margin: '2rem 0 3rem 0' }} />

          <div className="features-grid" style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '2rem' 
          }}>
            <div className="feature-item" style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div className="feature-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🚀</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Cepat & Real-time</h3>
              <p style={{ fontSize: '0.95rem', margin: 0 }}>Visualisasi kartu diperbarui seketika seiring dengan ketikan Anda tanpa perlu jeda (*loading*).</p>
            </div>
            
            <div className="feature-item" style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div className="feature-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Privasi Penuh</h3>
              <p style={{ fontSize: '0.95rem', margin: 0 }}>Pemrosesan lokal (*Client-Side*) menjamin data Anda tidak akan pernah bocor ke internet.</p>
            </div>
            
            <div className="feature-item" style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div className="feature-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🖨️</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>Resolusi Cetak</h3>
              <p style={{ fontSize: '0.95rem', margin: 0 }}>Mendukung pengunduhan berkas resolusi tinggi yang siap dicetak pada media kartu PVC sungguhan.</p>
            </div>
            
            <div className="feature-item" style={{ padding: '1.5rem', background: 'var(--bg-primary)', borderRadius: '16px', border: '1px solid var(--border-color)', textAlign: 'center' }}>
              <div className="feature-icon" style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>💸</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.1rem' }}>100% Gratis</h3>
              <p style={{ fontSize: '0.95rem', margin: 0 }}>Semua layanan kami dapat digunakan secara cuma-cuma tanpa batasan. Jika Anda merasa web ini bermanfaat, cukup donasikan seikhlasnya untuk membantu kami terus berkembang.</p>
            </div>
          </div>

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
