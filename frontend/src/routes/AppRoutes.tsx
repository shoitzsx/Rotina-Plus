import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Loading from '@/components/common/Loading';
import Home from '@/pages/Home';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';

export default function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;

  return (
    <Routes>
      {/* Public */}
      <Route path="/login"    element={!user ? <Login />    : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />

      {/* Protected */}
      <Route path="/" element={user ? <Home /> : <Navigate to="/login" replace />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
