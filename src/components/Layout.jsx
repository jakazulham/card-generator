import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <header className="saas-header">
        <div className="header-container">
          <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
            <div className="logo-icon">🪪</div>
            <div className="logo-text">
              <h1>CetakKartu</h1>
              <p>Cetak Kartu Online</p>
            </div>
          </Link>
          
          <button 
            className="hamburger-btn" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <nav className={`main-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Link to="/" className={currentPath === '/' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
            
            <div className="nav-dropdown">
              <span className="dropdown-trigger">Buat Kartu ▾</span>
              <div className="dropdown-menu">
                <Link to="/nisn" className={currentPath === '/nisn' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Buat kartu NISN</Link>
              </div>
            </div>

            <Link to="/about" className={currentPath === '/about' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Tentang Kami</Link>
            <a href="#" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
            <Link to="/contact" className={currentPath === '/contact' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Kontak</Link>
            <Link to="/disclaimer" className={currentPath === '/disclaimer' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Disclaimer</Link>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>

      <footer className="saas-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="logo-container">
              <div className="logo-icon" style={{ fontSize: '1.5rem' }}>🪪</div>
              <div className="logo-text">
                <h2 style={{ fontSize: '1.2rem', margin: 0, color: 'var(--text-primary)' }}>CetakKartu.com</h2>
              </div>
            </div>
            <p className="footer-desc">
              Platform modern untuk membuat dan mencetak berbagai kartu identitas digital secara cepat, gratis, dan profesional tanpa perlu keahlian desain.
            </p>
          </div>
          
          <div className="footer-col">
            <h3>Produk Kami</h3>
            <Link to="/nisn">Kartu NISN</Link>
            <span className="coming-soon-link">Kartu Pelajar (Segera)</span>
            <span className="coming-soon-link">Kartu BPJS (Segera)</span>
            <span className="coming-soon-link">Kartu NUPTK (Segera)</span>
          </div>
          <div className="footer-col">
            <h3>Perusahaan</h3>
            <Link to="/about">Tentang Kami</Link>
            <Link to="/contact">Hubungi Kami</Link>
            <Link to="/disclaimer">Syarat & Ketentuan</Link>
            <Link to="/disclaimer">Kebijakan Privasi</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CetakKartu.com - Hak Cipta Dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}
