import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/jaka/login');
  };

  const isActive = (path) => {
    if (path === '/jaka') return location.pathname === '/jaka';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { path: '/jaka', label: '📋 Dashboard', exact: true },
    { path: '/jaka/posts/new', label: '✏️ Tulis Artikel', exact: false },
    { path: '/jaka/categories', label: '📁 Kategori', exact: false },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/jaka" className="admin-logo">
            <span className="admin-logo-icon">🪪</span>
            <span className="admin-logo-text">CetakKartu Admin</span>
          </Link>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${isActive(item.path) && (item.exact ? location.pathname === item.path : true) ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <div className="admin-user-info">
            <div className="admin-user-avatar">{user?.displayName?.charAt(0) || 'A'}</div>
            <div>
              <div className="admin-user-name">{user?.displayName || user?.username}</div>
              <div className="admin-user-role">Administrator</div>
            </div>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>
            🚪 Keluar
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="admin-main">
        <header className="admin-topbar">
          <button
            className="admin-hamburger"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div className="admin-topbar-title">Panel Admin</div>
          <Link to="/" className="admin-view-site" target="_blank" rel="noopener">
            🌐 Lihat Situs
          </Link>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
