import { useAuth } from '../lib/auth';

export function DashboardPage() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Bem-vindo, {user?.displayName ?? user?.email}.</p>
      <p className="muted">Use o menu lateral para gerenciar notícias, eventos e mídia.</p>
    </div>
  );
}
