import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  return (
    <div className="layout-wrapper" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100%' }}>
      <header className="saas-header">
        <div className="header-container">
          <Link to="/" className="logo-container" style={{ textDecoration: 'none' }}>
            <div className="logo-text">
              <h1>Cetak<span className="logo-dot">Kartu</span></h1>
              <p>Buat Kartu Instan, Cetak Dimana Aja</p>
            </div>
          </Link>
          
          <div className="header-actions">
            <button
              className={`hamburger-btn ${isMobileMenuOpen ? 'open' : ''}`}
              onClick={() => {
                setIsMobileMenuOpen(!isMobileMenuOpen);
                setMobileDropdownOpen(false);
              }}
              aria-label="Toggle menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Mobile Menu Overlay */}
          <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)} />

          <nav className="main-nav desktop-only">
            <Link to="/" className={currentPath === '/' ? 'active' : ''}>Beranda</Link>
            <Link to="/contact" className={currentPath === '/contact' ? 'active' : ''}>Kontak</Link>
            <Link to="/blog" className={currentPath.startsWith('/blog') ? 'active' : ''}>Blog</Link>
            <Link to="/buat-kartu" className="nav-cta-btn">Buat Kartu</Link>
          </nav>

          <nav className={`main-nav mobile-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <div className="mobile-nav-header">
              <Link to="/" className="logo-container" style={{ textDecoration: 'none' }} onClick={() => setIsMobileMenuOpen(false)}>
                <div className="logo-text">
                  <h1>Cetak<span className="logo-dot">Kartu</span></h1>
                  <p>Buat Kartu Instan, Cetak Dimana Aja</p>
                </div>
              </Link>
              <button
                className="mobile-close-btn"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>

            <div className="mobile-nav-links">
              <Link to="/" className={currentPath === '/' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Beranda</Link>
              <Link to="/contact" className={currentPath === '/contact' ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Kontak</Link>
              <Link to="/blog" className={currentPath.startsWith('/blog') ? 'active' : ''} onClick={() => setIsMobileMenuOpen(false)}>Blog</Link>
              <Link to="/buat-kartu" className={`mobile-nav-cta ${currentPath.startsWith('/nisn') || currentPath.startsWith('/bpjs') || currentPath === '/buat-kartu' ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>Buat Kartu</Link>
            </div>

            <div className="mobile-nav-footer">
              <button
                className="theme-toggle-btn"
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
              >
                {theme === 'light' ? '🌜 Dark Mode' : '🌞 Light Mode'}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <main style={{ flex: 1, width: '100%' }}>
        <Outlet />
      </main>

      <footer className="saas-footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0, fontFamily: 'var(--font-display)', fontWeight: 800, color: '#fff' }}>Cetak<span style={{ color: '#60a5fa' }}>Kartu</span><span style={{ fontWeight: 400, fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)' }}>.com</span></h2>
            </div>
            <p className="footer-desc">
              Platform modern untuk membuat dan mencetak berbagai kartu identitas digital secara cepat, gratis, dan profesional tanpa perlu keahlian desain.
            </p>
          </div>
          
          <div className="footer-col">
            <h3>Produk Kami</h3>
            <Link to="/buat-kartu">Semua Kartu</Link>
            <Link to="/nisn">Kartu NISN</Link>
            <Link to="/bpjs">Kartu BPJS</Link>
            <span className="coming-soon-link">Kartu Pelajar (Segera)</span>
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
