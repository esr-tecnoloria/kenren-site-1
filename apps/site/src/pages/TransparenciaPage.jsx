import { useEffect, useMemo, useState } from 'react';

const projects = [
  {
    year: 2020,
    title: '23º Festival do Japão',
    ministry: 'Sec. de Cultura, Economia e Indústria Criativa',
    sphere: 'Estadual',
    value: 250000,
    status: 'executed',
    statusLabel: 'Executado',
    parliamentarian: 'Marcio Nakashima',
    amendment: 'Emenda Estadual',
    agreement: 'Termo de Fomento Estadual',
    docs: [
      { label: 'Emenda Estadual', type: 'PDF' },
      { label: 'Prestação de Contas', type: 'PDF' },
      { label: 'Termo de Fomento', type: 'PDF' },
    ],
  },
  {
    year: 2023,
    title: '24º Festival do Japão — Mottanai',
    ministry: 'Sec. de Cultura, Economia e Indústria Criativa',
    sphere: 'Estadual',
    value: 300000,
    status: 'executed',
    statusLabel: 'Executado',
    parliamentarian: 'Marcio Nakashima',
    amendment: 'Emenda Estadual',
    agreement: 'Termo de Fomento Estadual',
    docs: [
      { label: 'Emenda Estadual', type: 'PDF' },
      { label: 'Prestação de Contas', type: 'PDF' },
      { label: 'Termo de Fomento', type: 'PDF' },
    ],
  },
  {
    year: 2024,
    title: '25º Festival do Japão — Ikigai',
    ministry: 'Sec. de Cultura, Economia e Indústria Criativa',
    sphere: 'Estadual',
    value: 300000,
    status: 'executed',
    statusLabel: 'Executado',
    parliamentarian: 'Marcio Nakashima',
    amendment: 'Emenda Estadual',
    agreement: 'Termo de Fomento Estadual',
    docs: [
      { label: 'Emenda Estadual', type: 'PDF' },
      { label: 'Prestação de Contas', type: 'PDF' },
      { label: 'Termo de Fomento', type: 'PDF' },
    ],
  },
  {
    year: 2025,
    title: '26º Festival do Japão',
    ministry: 'Sec. de Cultura, Economia e Indústria Criativa',
    sphere: 'Estadual',
    value: 300000,
    status: 'accounting',
    statusLabel: 'Em prestação de contas',
    parliamentarian: 'Marcio Nakashima',
    amendment: 'Emenda Estadual',
    agreement: 'Termo de Fomento Estadual',
    docs: [
      { label: 'Emenda Estadual', type: 'PDF' },
      { label: 'Termo de Fomento', type: 'PDF' },
    ],
  },
  {
    year: 2025,
    title: '26º Festival do Japão',
    ministry: 'Ministério da Cultura',
    sphere: 'Federal',
    value: 500000,
    status: 'accounting',
    statusLabel: 'Em prestação de contas',
    parliamentarian: 'Kim Kataguiri',
    amendment: 'Emenda Federal',
    agreement: 'Termo de Fomento Federal',
    docs: [
      { label: 'Emenda Federal', type: 'PDF' },
      { label: 'Termo de Fomento', type: 'PDF' },
    ],
  },
];

const institutionalDocs = [
  {
    icon: '📜',
    title: 'Estatuto Social',
    description: 'Normas e diretrizes que regem nossa associação.',
    badge: 'Documento oficial',
  },
  {
    icon: '🗂️',
    title: 'Atas de Reuniões',
    description: 'Registros públicos das decisões da diretoria.',
    badge: 'Atualizado periodicamente',
  },
];

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'executed', label: 'Executados' },
  { id: 'accounting', label: 'Em prestação de contas' },
];

const formatCurrency = (value) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export default function TransparenciaPage() {
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = useMemo(() => {
    const total = projects.reduce((sum, p) => sum + p.value, 0);
    const executed = projects.filter(p => p.status === 'executed').length;
    const inAccounting = projects.filter(p => p.status === 'accounting').length;
    return { total, executed, inAccounting, count: projects.length };
  }, []);

  const visibleProjects = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter(p => p.status === filter);
  }, [filter]);

  return (
    <>
      <section className="page-banner transp-banner">
        <div className="page-banner-overlay"></div>
        <div className="container">
          <span className="transp-eyebrow">Prestação de contas</span>
          <h1 className="page-banner-title">Transparência e Projetos</h1>
          <p className="page-banner-subtitle">
            Compromisso com a lisura e a responsabilidade na gestão de recursos públicos
          </p>
        </div>
      </section>

      <section className="transp-intro">
        <div className="container">
          <div className="transp-intro-card">
            <div className="transp-intro-icon" aria-hidden="true">🤝</div>
            <div>
              <h2>Nosso compromisso público</h2>
              <p>
                Confira abaixo a relação dos projetos realizados pela KENREN, com detalhes de cada
                emenda, termo de fomento e prestação de contas. Reafirmamos nosso compromisso com a
                lisura e a responsabilidade na gestão de recursos públicos.
              </p>
            </div>
          </div>

          <div className="transp-stats">
            <div className="transp-stat">
              <span className="transp-stat-value">{formatCurrency(stats.total)}</span>
              <span className="transp-stat-label">Total captado em emendas</span>
            </div>
            <div className="transp-stat">
              <span className="transp-stat-value">{stats.count}</span>
              <span className="transp-stat-label">Projetos divulgados</span>
            </div>
            <div className="transp-stat">
              <span className="transp-stat-value">{stats.executed}</span>
              <span className="transp-stat-label">Executados</span>
            </div>
            <div className="transp-stat">
              <span className="transp-stat-value">{stats.inAccounting}</span>
              <span className="transp-stat-label">Em prestação de contas</span>
            </div>
          </div>
        </div>
      </section>

      <section className="transp-projects">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Projetos & Convênios</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Linha do tempo dos projetos viabilizados por emendas parlamentares</p>
          </div>

          <div className="transp-filters" role="tablist">
            {filters.map(f => (
              <button
                key={f.id}
                role="tab"
                aria-selected={filter === f.id}
                className={`transp-filter${filter === f.id ? ' active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <ol className="transp-timeline">
            {visibleProjects.map((p, i) => (
              <li key={`${p.year}-${p.sphere}-${i}`} className="transp-timeline-item">
                <div className="transp-timeline-marker">
                  <span className="transp-timeline-year">{p.year}</span>
                </div>
                <article className={`transp-card transp-card--${p.status}`}>
                  <header className="transp-card-head">
                    <div className="transp-card-titleblock">
                      <span className={`transp-pill transp-pill--${p.sphere.toLowerCase()}`}>
                        {p.sphere}
                      </span>
                      <h3 className="transp-card-title">{p.title}</h3>
                      <p className="transp-card-ministry">{p.ministry}</p>
                    </div>
                    <span className={`transp-status transp-status--${p.status}`}>
                      <span className="transp-status-dot" aria-hidden="true"></span>
                      {p.statusLabel}
                    </span>
                  </header>

                  <dl className="transp-card-grid">
                    <div>
                      <dt>Valor da emenda</dt>
                      <dd className="transp-card-value">{formatCurrency(p.value)}</dd>
                    </div>
                    <div>
                      <dt>Parlamentar</dt>
                      <dd>{p.parliamentarian}</dd>
                    </div>
                    <div>
                      <dt>Tipo</dt>
                      <dd>{p.amendment}</dd>
                    </div>
                    <div>
                      <dt>Convênio</dt>
                      <dd>{p.agreement}</dd>
                    </div>
                  </dl>

                  <footer className="transp-card-docs">
                    <span className="transp-card-docs-label">Documentos disponíveis</span>
                    <div className="transp-card-docs-list">
                      {p.docs.map((d, idx) => (
                        <a
                          key={idx}
                          href="#"
                          className="transp-doc-chip"
                          onClick={(e) => e.preventDefault()}
                        >
                          <span className="transp-doc-chip-icon" aria-hidden="true">📄</span>
                          <span>{d.label}</span>
                          <span className="transp-doc-chip-type">{d.type}</span>
                        </a>
                      ))}
                    </div>
                  </footer>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="transp-institutional">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Documentos Institucionais</h2>
            <div className="title-underline"></div>
            <p className="section-subtitle">Acesso público aos principais documentos da federação</p>
          </div>

          <div className="transp-doc-grid">
            {institutionalDocs.map((doc) => (
              <a key={doc.title} href="#" className="transp-doc-card" onClick={(e) => e.preventDefault()}>
                <div className="transp-doc-card-icon" aria-hidden="true">{doc.icon}</div>
                <div className="transp-doc-card-body">
                  <span className="transp-doc-card-badge">{doc.badge}</span>
                  <h3>{doc.title}</h3>
                  <p>{doc.description}</p>
                </div>
                <div className="transp-doc-card-cta">
                  <span>Baixar</span>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 3v12" />
                    <path d="m7 10 5 5 5-5" />
                    <path d="M5 21h14" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="transp-cta">
        <div className="container">
          <div className="transp-cta-card">
            <div>
              <h2>Encontrou alguma divergência?</h2>
              <p>
                A KENREN preza pela transparência total. Caso identifique inconsistências ou queira
                solicitar informações adicionais, entre em contato com a nossa diretoria.
              </p>
            </div>
            <a href="mailto:contato@kenren.org.br" className="btn btn-primary transp-cta-btn">
              Falar com a diretoria
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
