import { useEffect, useState, useCallback } from 'react';

const BASE = import.meta.env.BASE_URL;

const MONUMENTOS = [
  {
    id: 'ireihi',
    nome: 'Memorial Ireihi',
    kanji: '開拓先没者慰霊碑',
    subtitulo: 'Memorial em Homenagem aos Imigrantes Pioneiros Falecidos',
    imagem: `${BASE}assets/images/monumento_ireihi.jpg`,
    local: 'Parque Ibirapuera, São Paulo – SP',
    resumo:
      'Memorial em homenagem aos imigrantes pioneiros falecidos, localizado no coração do Parque Ibirapuera.',
    descricao: [
      'Graças à contribuição e participação de muitos, no ano de 1975 foi construído o Memorial em Homenagem aos Imigrantes Pioneiros Falecidos, no Parque Ibirapuera, na cidade de São Paulo. Este Memorial, que reúne centenas de milhares de almas dos imigrantes pioneiros, hoje é tido como base sentimental da imigração japonesa no Brasil.',
      'O culto religioso que se realiza anualmente no dia 18 de junho, “Dia do Imigrante”, já se tornou um evento oficial da comunidade nipo-brasileira. Ao longo dos anos, o Memorial recebeu honrosas visitas de Suas Majestades o Imperador e a Imperatriz do Japão, de membros da família imperial e de altas autoridades governamentais do Brasil e do Japão.',
    ],
    especificacoes: [
      { rotulo: 'Inauguração', valor: '23 de agosto de 1975' },
      { rotulo: 'Material', valor: 'Granito negro' },
      { rotulo: 'Dimensões', valor: '170 × 250 × 30 cm — mais de 5 toneladas' },
      { rotulo: 'Caligrafia do epitáfio', valor: 'Primeiro-Ministro Kakuei Tanaka' },
      { rotulo: 'Projeto', valor: 'Engenheiro Takeshi Suzuki' },
      { rotulo: 'Realização', valor: 'Federação das Associações de Províncias do Japão no Brasil' },
    ],
    textos: [],
    brochura: `${BASE}assets/docs/ireihi.pdf`,
  },
  {
    id: 'desembarque',
    nome: 'Monumento do Desembarque',
    kanji: 'サントス日本移民上陸記念碑',
    subtitulo: 'Monumento do Desembarque de Imigrantes Japoneses em Santos',
    imagem: `${BASE}assets/images/monumento_desembarque.jpg`,
    local: 'Praça Roberto Mário Santini, Santos – SP',
    resumo:
      'Marco do ponto de origem da imigração japonesa no Brasil, na orla de Santos.',
    descricao: [
      'De 18 de junho de 1908, quando a primeira leva de imigrantes desembarcou no porto de Santos, a bordo do Kasato Maru, até 27 de março de 1973, quando o último barco, o Nippon Maru, trouxe os últimos 256 imigrantes, nos períodos antes e depois da guerra, aproximadamente 240.000 japoneses migraram-se para o Brasil.',
      'Foi sugerida a construção do Monumento do Desembarque de Imigrantes Japoneses em Santos na ocasião do 90º Aniversário da Imigração Japonesa, local considerado como ponto de origem da imigração japonesa ao Brasil. Em 21 de junho de 1998, o Monumento foi solenemente inaugurado na Ponta da Praia.',
      'Em 2009 foi transferido para a Praça Roberto Mário Santini, próxima à divisa entre Santos e São Vicente, onde se encontra também o monumento em comemoração ao Centenário da Imigração Japonesa, de autoria da artista plástica Tomie Ohtake.',
    ],
    especificacoes: [
      { rotulo: 'Inauguração', valor: '18 de junho de 1998' },
      { rotulo: 'Altura da estátua', valor: '2,15 m' },
      { rotulo: 'Pedestal', valor: '1,30 × 1,30 × 2,30 m' },
      { rotulo: 'Altura total', valor: '4,45 m' },
      { rotulo: 'Peso da estátua', valor: '9.700 kg' },
      { rotulo: 'Material', valor: 'Bronze, concreto e granito' },
      { rotulo: 'Realização', valor: 'Federação das Associações de Províncias do Japão no Brasil' },
      { rotulo: 'Endereço', valor: 'Av. Presidente Wilson, em frente ao nº 169 — Bairro José Menino, Santos – SP · Tel. (13) 3288-4404' },
    ],
    textos: [
      {
        titulo: 'Texto frontal',
        corpo: 'Aos Imigrantes Japoneses',
        autoria: 'Caligrafia do Primeiro-Ministro japonês Ryutaro Hashimoto',
      },
      {
        titulo: 'Texto posterior',
        corpo:
          'A saga dos Imigrantes Japoneses, iniciada no Porto de Santos em 18 de junho de 1908, completa 90 anos. Dos 250.000 imigrantes sobrevivem 80.000 e, incluídos os descendentes, somam 1.400.000 que hoje vivem e labutam nesta Terra.',
        autoria: 'Sussumu Miyao',
      },
    ],
    brochura: null,
  },
];

function MonumentoModal({ monumento, onClose }) {
  const handleKey = useCallback(
    (e) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prev;
    };
  }, [handleKey]);

  if (!monumento) return null;

  return (
    <div className="mon-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={monumento.subtitulo}>
      <div className="mon-modal" onClick={(e) => e.stopPropagation()}>
        <button className="mon-modal-close" onClick={onClose} aria-label="Fechar">&times;</button>

        <div className="mon-modal-hero">
          <img src={monumento.imagem} alt={monumento.subtitulo} />
          <div className="mon-modal-hero-overlay" />
          <span className="mon-modal-kanji">{monumento.kanji}</span>
          <div className="mon-modal-hero-text">
            <h2>{monumento.nome}</h2>
            <p className="mon-modal-sub">{monumento.subtitulo}</p>
            <p className="mon-modal-local">📍 {monumento.local}</p>
          </div>
        </div>

        <div className="mon-modal-body">
          {monumento.descricao.map((par, i) => (
            <p key={i} className="mon-modal-par">{par}</p>
          ))}

          {monumento.textos.length > 0 && (
            <div className="mon-modal-quotes">
              {monumento.textos.map((t, i) => (
                <blockquote key={i} className="mon-quote">
                  <span className="mon-quote-label">{t.titulo}</span>
                  <p className="mon-quote-body">“{t.corpo}”</p>
                  <cite>— {t.autoria}</cite>
                </blockquote>
              ))}
            </div>
          )}

          {monumento.especificacoes.length > 0 && (
            <div className="mon-specs">
              <h3 className="mon-specs-title">Ficha técnica</h3>
              <dl className="mon-specs-grid">
                {monumento.especificacoes.map((s, i) => (
                  <div key={i} className="mon-spec">
                    <dt>{s.rotulo}</dt>
                    <dd>{s.valor}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {monumento.brochura && (
            <a className="mon-brochure-btn" href={monumento.brochura} target="_blank" rel="noopener noreferrer">
              <span className="mon-brochure-ico">📖</span>
              Ler a brochura completa (PDF)
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MonumentosSection() {
  const [aberto, setAberto] = useState(null);
  const monumento = MONUMENTOS.find((m) => m.id === aberto) || null;

  return (
    <section className="monumentos-section" id="monumentos">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Monumentos</h2>
          <div className="title-underline"></div>
        </div>
        <p className="monumentos-intro">
          Erguidos pela KENREN, estes marcos honram a memória dos pioneiros e contam a saga da imigração japonesa no Brasil.
        </p>

        <div className="monumentos-grid">
          {MONUMENTOS.map((m) => (
            <button key={m.id} className="monumento-card" onClick={() => setAberto(m.id)} aria-label={`Ver detalhes: ${m.subtitulo}`}>
              <div className="monumento-media">
                <img src={m.imagem} alt={m.subtitulo} />
                <span className="monumento-kanji">{m.kanji}</span>
                <div className="monumento-media-overlay" />
              </div>
              <div className="monumento-info">
                <h3>{m.nome}</h3>
                <p className="monumento-location">📍 {m.local}</p>
                <p className="monumento-resumo">{m.resumo}</p>
                <span className="monumento-cta">Ver detalhes →</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {monumento && <MonumentoModal monumento={monumento} onClose={() => setAberto(null)} />}
    </section>
  );
}
