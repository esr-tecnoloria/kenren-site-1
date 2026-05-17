import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './lib/auth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { NewsListPage } from './pages/NewsListPage';
import { NewsEditPage } from './pages/NewsEditPage';
import { EventsListPage } from './pages/EventsListPage';
import { EventEditPage } from './pages/EventEditPage';
import { KenjinkaisListPage } from './pages/KenjinkaisListPage';
import { KenjinkaiEditPage } from './pages/KenjinkaiEditPage';
import { NewsCategoriesPage } from './pages/NewsCategoriesPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<DashboardPage />} />
              <Route path="news" element={<NewsListPage />} />
              <Route path="news/new" element={<NewsEditPage />} />
              <Route path="news/:id" element={<NewsEditPage />} />
              <Route path="events" element={<EventsListPage />} />
              <Route path="events/new" element={<EventEditPage />} />
              <Route path="events/:id" element={<EventEditPage />} />
              <Route path="kenjinkais" element={<KenjinkaisListPage />} />
              <Route path="kenjinkais/:id" element={<KenjinkaiEditPage />} />
              <Route path="news-categories" element={<NewsCategoriesPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
