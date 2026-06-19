import React from 'react';

export default function Contact() {
  return (
    <div className="page-container" style={{ padding: '4rem 2rem', minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      
      <div className="contact-header" style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="responsive-page-title">
          Hubungi Kami
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '650px', margin: '0 auto', lineHeight: '1.6' }}>
          Kami di CetakKartu.com selalu siap membantu Anda. Jika Anda memiliki pertanyaan seputar cara pembuatan kartu, butuh bantuan teknis, ingin melaporkan *bug*, atau sekadar memberikan kritik dan saran demi pengembangan platform ini, jangan ragu untuk menyapa kami!
        </p>
      </div>
      
      <div className="glass-card contact-glass-card" style={{ 
        maxWidth: '800px', 
        width: '100%', 
        backgroundColor: 'var(--bg-secondary)',
        backgroundImage: `
          radial-gradient(circle at 0% 0%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 100% 100%, rgba(37, 211, 102, 0.08) 0%, transparent 50%),
          url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
        `,
        border: '1px solid var(--border-color)',
        borderRadius: '24px',
        padding: '4rem 3rem',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        
        <div className="contact-inner-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
          
          {/* WhatsApp Card */}
          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '2rem', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', background: '#25D366', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', marginBottom: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(37, 211, 102, 0.3)'
            }}>
              💬
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>WhatsApp (Fast Response)</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Punya kendala mendesak atau butuh panduan langsung? Chat tim dukungan kami via WhatsApp.
            </p>
            <a 
              href="https://wa.me/628137900494" 
              target="_blank" 
              rel="noopener noreferrer" 
              style={{ 
                marginTop: 'auto',
                background: '#25D366', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: '600',
                display: 'inline-block',
                width: '100%'
              }}
            >
              Chat Sekarang
            </a>
          </div>

          {/* Email Card */}
          <div style={{ 
            background: 'var(--bg-primary)', 
            padding: '2rem', 
            borderRadius: '16px', 
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            transition: 'transform 0.2s',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={{ 
              width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent, #3b82f6)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', marginBottom: '1.5rem',
              boxShadow: '0 10px 15px -3px rgba(59, 130, 246, 0.3)'
            }}>
              📧
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>Email Support</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              Untuk pertanyaan umum, pelaporan kendala (bug), atau tawaran kerjasama kemitraan.
            </p>
            <a 
              href="mailto:jakazulham2@gmail.com" 
              style={{ 
                marginTop: 'auto',
                background: 'var(--accent, #3b82f6)', 
                color: 'white', 
                padding: '0.75rem 1.5rem', 
                borderRadius: '8px', 
                textDecoration: 'none', 
                fontWeight: '600',
                display: 'inline-block',
                width: '100%'
              }}
            >
              Kirim Email
            </a>
          </div>

        </div>

        <div style={{ 
          marginTop: '4rem', 
          padding: '2rem', 
          background: 'var(--bg-primary)', 
          borderRadius: '16px',
          border: '1px solid var(--border-color)',
          textAlign: 'center' 
        }}>
          <h4 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>⏰ Jam Operasional Dukungan</h4>
          <p style={{ color: 'var(--text-secondary)' }}>Senin - Jumat: 09:00 - 17:00 WIB</p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Pesan yang masuk di luar jam operasional akan kami balas pada hari kerja berikutnya.</p>
        </div>
        
      </div>
    </div>
  );
}
