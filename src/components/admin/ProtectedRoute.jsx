import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', background: 'var(--bg-primary)',
      }}>
        <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          Memuat...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/jaka/login" replace />;
  }

  return <Outlet />;
}
