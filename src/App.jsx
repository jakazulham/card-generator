import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ScrollToTop from './components/ScrollToTop';

// Eager-loaded pages (main site)
import Home from './pages/Home';
import NisnGenerator from './pages/NisnGenerator';
import BpjsGenerator from './pages/BpjsGenerator';
import CardSelector from './pages/CardSelector';
import About from './pages/About';
import Contact from './pages/Contact';
import Disclaimer from './pages/Disclaimer';

// Blog pages (eager-loaded for SEO)
import BlogList from './pages/blog/BlogList';
import BlogPost from './pages/blog/BlogPost';

// Admin pages (lazy-loaded — only loaded when /jaka/ is visited)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminEditor = lazy(() => import('./pages/admin/AdminEditor'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'));
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'));

function AdminFallback() {
  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', background: 'var(--bg-primary)',
    }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
        Memuat panel admin...
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Public routes with main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="buat-kartu" element={<CardSelector />} />
          <Route path="nisn" element={<NisnGenerator />} />
          <Route path="bpjs" element={<BpjsGenerator />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="disclaimer" element={<Disclaimer />} />

          {/* Blog routes */}
          <Route path="blog">
            <Route index element={<BlogList />} />
            <Route path="kategori/:categorySlug" element={<BlogList />} />
            <Route path=":slug" element={<BlogPost />} />
          </Route>
        </Route>

        {/* Admin routes (separate layout, no public header/footer) */}
        <Route path="/jaka/login" element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        } />
        <Route path="/jaka" element={
          <Suspense fallback={<AdminFallback />}>
            <ProtectedRoute />
          </Suspense>
        }>
          <Route element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLayout />
            </Suspense>
          }>
            <Route index element={
              <Suspense fallback={<AdminFallback />}>
                <AdminDashboard />
              </Suspense>
            } />
            <Route path="posts/new" element={
              <Suspense fallback={<AdminFallback />}>
                <AdminEditor />
              </Suspense>
            } />
            <Route path="posts/edit/:id" element={
              <Suspense fallback={<AdminFallback />}>
                <AdminEditor />
              </Suspense>
            } />
            <Route path="categories" element={
              <Suspense fallback={<AdminFallback />}>
                <AdminCategories />
              </Suspense>
            } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
