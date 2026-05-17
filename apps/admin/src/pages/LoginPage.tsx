import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { signInWithGoogle } from '../lib/firebase';
import { useAuth } from '../lib/auth';

export function LoginPage() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [err, setErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <div className="loading">Carregando…</div>;
  if (user) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? '/';
    return <Navigate to={from} replace />;
  }

  async function handleLogin() {
    setErr(null);
    setSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (e) {
      setErr((e as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>KENREN Admin</h1>
        <p>Faça login com sua conta Google autorizada.</p>
        <button className="btn-primary" onClick={handleLogin} disabled={submitting}>
          {submitting ? 'Entrando…' : 'Entrar com Google'}
        </button>
        {err && <div className="error">{err}</div>}
      </div>
    </div>
  );
}
