import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="loading">Carregando…</div>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <>{children}</>;
}
