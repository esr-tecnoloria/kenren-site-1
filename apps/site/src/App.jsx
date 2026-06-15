import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import KenjinkaiPage from './pages/KenjinkaiPage';
import IndividualKenjinkaiPage from './pages/IndividualKenjinkaiPage';
import TransparenciaPage from './pages/TransparenciaPage';
import NewsPage from './pages/NewsPage';
import IndividualNewsPage from './pages/IndividualNewsPage';
import AgendaPage from './pages/AgendaPage';
import IndividualEventPage from './pages/IndividualEventPage';
import './styles/style.css';
import './styles/kenjinkais.css';
import './styles/transparencia.css';
import './styles/news.css';
import './styles/monumentos.css';

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/kenjinkais" element={<KenjinkaiPage />} />
        <Route path="/kenjinkais/:slug" element={<IndividualKenjinkaiPage />} />
        <Route path="/transparencia" element={<TransparenciaPage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/eventos/:slug" element={<IndividualEventPage />} />
        <Route path="/noticias" element={<NewsPage />} />
        <Route path="/noticias/:slug" element={<IndividualNewsPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
