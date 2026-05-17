import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { regionFilterButtons } from '../data/prefectures';
import { useKenjinkais } from '../data/useKenjinkais';
import JapanMap from '../components/JapanMap';

export default function KenjinkaiPage() {
  const { bySlug, loading } = useKenjinkais();
  const [selectedPref, setSelectedPref] = useState(null);
  const [activeRegion, setActiveRegion] = useState('all');
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handlePrefClick = (prefId) => {
    setSelectedPref(prefId);
    if (window.innerWidth <= 768 && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  const handleClose = () => setSelectedPref(null);

  const handleFilterClick = (filter) => setActiveRegion(filter);

  const data = selectedPref ? bySlug[selectedPref] : null;

  return (
    <>
      {/* Page Banner */}
      <section className="page-banner">
        <div className="page-banner-overlay"></div>
        <div className="container">
          <h1 className="page-banner-title">Kenjinkais</h1>
          <p className="page-banner-subtitle">Associações das 47 Províncias do Japão no Brasil</p>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Mapa das Províncias</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Clique em uma província para ver as informações do Kenjinkai</p>
          </div>

          <div className="map-layout">
            <aside className="region-filters">
              {regionFilterButtons.map(btn => (
                <button
                  key={btn.filter}
                  className={`region-filter-btn${activeRegion === btn.filter ? ' active' : ''}`}
                  data-filter={btn.filter}
                  onClick={() => handleFilterClick(btn.filter)}
                >
                  <span className="filter-color" style={{ background: btn.color }}></span> {btn.label}
                </button>
              ))}
            </aside>

            <div className="map-wrapper">
              <JapanMap
                selectedState={selectedPref}
                onStateSelect={handlePrefClick}
                activeRegion={activeRegion}
                prefectureData={bySlug}
              />
            </div>
          </div>

          {/* Prefecture Detail Panel */}
          <div className={`pref-detail-panel${selectedPref ? ' panel-active' : ''}`} id="prefDetailPanel" ref={panelRef}>
            {!selectedPref || !data ? (
              <div className="pref-detail-placeholder">
                <div className="placeholder-icon">🇯🇵</div>
                <p>{loading ? 'Carregando dados…' : 'Selecione uma província no mapa para ver os detalhes do Kenjinkai'}</p>
              </div>
            ) : (
              <div className="pref-detail-content" style={{ display: 'block' }}>
                <button className="pref-detail-close" aria-label="Fechar" onClick={handleClose}>&times;</button>
                <div className="pref-detail-header">
                  <span className="pref-detail-kanji">{data.kanji}</span>
                  <div>
                    <h3 className="pref-detail-name">{data.name}</h3>
                    <span className="pref-detail-region" style={{ background: data.regionColor }}>{data.region}</span>
                  </div>
                </div>
                <div className="pref-detail-body">
                  <div className="pref-detail-info">
                    <div className="detail-row">
                      <strong>Kenjinkai:</strong>
                      <span>{data.nomeKenjinkai || data.kenjinkai}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Capital:</strong>
                      <span>{data.capital}</span>
                    </div>
                    <div className="detail-row">
                      <strong>Região:</strong>
                      <span>{data.region}</span>
                    </div>
                  </div>
                  <p className="pref-detail-desc">{data.resumo || data.desc}</p>
                  <button
                    className="btn btn-primary pref-detail-cta"
                    onClick={() => navigate(`/kenjinkais/${selectedPref}`)}
                  >
                    Ver página do Kenjinkai
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
