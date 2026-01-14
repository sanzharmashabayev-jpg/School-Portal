import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { AdminLayout } from './components/Admin/AdminLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { AdminLogin } from './pages/AdminLogin';
import { Home } from './pages/Home';
import { News } from './pages/News';
import { Events } from './pages/Events';
import { Polls } from './pages/Polls';
import { Profile } from './pages/Profile';
import { Announcements } from './pages/Announcements';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminNews } from './pages/AdminNews';
import { AdminEvents } from './pages/AdminEvents';
import { AdminPolls } from './pages/AdminPolls';
import { AdminAnnouncements } from './pages/AdminAnnouncements';
import { useAuth } from './contexts/AuthContext';

function ProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen w-full bg-gradient-to-br from-white via-green-50 to-green-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-green-800 border-r-transparent"></div>
          <p className="mt-4 text-green-600">Загрузка...</p>
        </div>
      </div>;
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />;
}

function AdminProtectedRoute({
  children
}: {
  children: React.ReactNode;
}) {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen w-full bg-gradient-to-br from-green-900 via-green-800 to-green-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-red-600 border-r-transparent"></div>
          <p className="mt-4 text-green-400">Загрузка...</p>
        </div>
      </div>;
  }

  return user && isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />;
}
export function App() {
  return <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/portal/*" element={<ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/news" element={<News />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/polls" element={<Polls />} />
                  <Route path="/announcements" element={<Announcements />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </Layout>
            </ProtectedRoute>} />
        <Route path="/admin/*" element={<AdminProtectedRoute>
              <AdminLayout>
                <Routes>
                  <Route path="/dashboard" element={<AdminDashboard />} />
                  <Route path="/news" element={<AdminNews />} />
                  <Route path="/events" element={<AdminEvents />} />
                  <Route path="/polls" element={<AdminPolls />} />
                  <Route path="/announcements" element={<AdminAnnouncements />} />
                </Routes>
              </AdminLayout>
            </AdminProtectedRoute>} />
      </Routes>
    </Router>;
}