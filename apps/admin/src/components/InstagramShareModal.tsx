import { useMemo, useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  news: {
    title: string;
    slug: string;
    excerpt: string | null;
    coverUrl: string | null;
    categories?: Array<{ category: { name: string; slug: string } }>;
  };
};

const SITE_URL = 'https://kenren.web.app';
const BASE_HASHTAGS = ['kenren', 'culturajaponesa', 'japaonobrasil', 'nikkei'];

const slugToHashtag = (slug: string) =>
  '#' + slug.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/gi, '').toLowerCase();

export function InstagramShareModal({ open, onClose, news }: Props) {
  const [copied, setCopied] = useState(false);

  const caption = useMemo(() => {
    const tagsFromCategories = (news.categories ?? [])
      .map(c => slugToHashtag(c.category.slug))
      .filter(t => t.length > 1);
    const tags = Array.from(new Set([...tagsFromCategories, ...BASE_HASHTAGS.map(t => `#${t}`)])).join(' ');

    const link = `${SITE_URL}/noticias/${news.slug}`;
    const parts = [
      news.title,
      news.excerpt ?? '',
      `📰 Notícia completa: ${link}`,
      tags,
    ].filter(Boolean);
    return parts.join('\n\n');
  }, [news]);

  async function copyCaption() {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback for older browsers: select+copy on a temp textarea
      const ta = document.createElement('textarea');
      ta.value = caption;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  }

  if (!open) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Preparar para Instagram</h2>
          <button className="link-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <ol className="ig-steps">
            <li>
              <strong>Baixe a imagem</strong>
              {news.coverUrl ? (
                <>
                  <a href={news.coverUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary ig-step-btn">
                    Abrir imagem
                  </a>
                  <p className="muted ig-hint">
                    Abre em nova aba. No computador: botão direito → "Salvar imagem como…".
                    No celular: toque e segure → "Salvar foto".
                  </p>
                </>
              ) : (
                <p className="error">Notícia não tem imagem de capa — adicione antes de postar.</p>
              )}
            </li>

            <li>
              <strong>Copie a legenda</strong>
              <textarea className="ig-caption" readOnly value={caption} rows={10} />
              <button type="button" className="btn-primary ig-step-btn" onClick={copyCaption}>
                {copied ? '✓ Copiado' : 'Copiar legenda'}
              </button>
              <p className="muted ig-hint">
                Tem {caption.length}/2200 caracteres (limite do Instagram).
              </p>
            </li>

            <li>
              <strong>Abra o Instagram e poste</strong>
              <div className="ig-step-btns">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  Instagram Web
                </a>
                <a
                  href="instagram://camera"
                  className="btn-secondary"
                >
                  App no celular
                </a>
              </div>
              <p className="muted ig-hint">
                No app: ➕ Nova publicação → escolha a imagem baixada → cole a legenda.
              </p>
            </li>
          </ol>
        </div>

        <div className="modal-foot">
          <button className="btn-primary" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
}
