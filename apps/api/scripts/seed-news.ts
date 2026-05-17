/**
 * Seeds the initial news from kenren.org.br (scraped manually).
 * Idempotent by slug.
 *
 * Run: pnpm --filter @kenren/api seed:news
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const PUBLIC_BASE = 'https://storage.googleapis.com/kenren-media';

const NEWS = [
  {
    slug: '16o-konshinkai',
    title: '16º Konshinkai',
    excerpt: 'Formulário de inscrição para o 16º Konshinkai, bate-papo sobre as bolsas de estudos para Okinawa, em 08/02 na Associação Okinawa Kenjin do Brasil.',
    coverPath: 'news/16o-konshinkai.png',
    coverAlt: '16º Konshinkai — bolsas de estudo Okinawa',
    categories: ['Notícias'],
    publishedAt: '2025-11-24',
    bodyHtml: `
<p>Formulário de inscrição para o 16º Konshinkai, bate-papo sobre as bolsas de estudos para Okinawa, que ocorrerá dia 08/02 (sábado) das 14h às 18h, na Associação Okinawa Kenjin do Brasil.</p>
<p><strong>Endereço:</strong> Rua Dr. Tomas de Lima, 72 – Liberdade, São Paulo – SP, 2º andar.</p>
<p><strong>Data:</strong> 08/02/25 (sábado)<br/>
<strong>Horário:</strong> 14h às 18h<br/>
<strong>Inscrições até:</strong> 06/02/25 (quinta-feira)<br/>
<strong>Taxa de contribuição:</strong> R$10,00 (dez reais)<br/>
<strong>Chave Pix:</strong> urizun.br@gmail.com</p>
<p>Enviar o comprovante do Pix para: urizun.br@gmail.com</p>
<p><strong>Formulário para inscrição:</strong> <a href="https://forms.gle/NgGe9DAnBq8sz8wH7" target="_blank" rel="noopener">https://forms.gle/NgGe9DAnBq8sz8wH7</a></p>
`.trim(),
  },
  {
    slug: 'iv-simposio-organizadores-festival-do-japao',
    title: 'IV Simpósio de organizadores do Festival do Japão',
    excerpt: 'Kenren e o Consulado Geral do Japão realizam o IV Simpósio de Organizadores de Festivais do Japão em São Paulo, com inscrições gratuitas.',
    coverPath: 'news/iv-simposio-de-organizadores-do-festival-do-japao.png',
    coverAlt: 'IV Simpósio de Organizadores do Festival do Japão',
    categories: ['Destaques', 'Notícias'],
    publishedAt: '2025-11-24',
    bodyHtml: `
<p>A Kenren – Federação das Associações de Províncias do Japão no Brasil e o Consulado Geral do Japão, com o apoio do SPExpo, estão realizando o IV Simpósio de Organizadores de Festivais do Japão. Venha participar!</p>
<p>📌 <strong>Data:</strong> 25 de março de 2023<br/>
⏰ <strong>Horário:</strong> A partir das 8h30 (Welcome Coffee)<br/>
📍 <strong>Local:</strong> São Paulo EXPO – Sala 208</p>
<p><strong>INSCRIÇÕES GRATUITAS</strong></p>
`.trim(),
  },
  {
    slug: 'informativo-emenda-festival-do-japao-2025',
    title: 'Informativo — Emenda Federal para o 26º Festival do Japão',
    excerpt: 'Publicamos o fomento da Emenda Federal nº 006346/2024, cedente o Deputado Federal Kim Kataguiri, para a realização do 26º Festival do Japão.',
    coverPath: 'news/informativo.png',
    coverAlt: 'Informativo — Emenda Federal Festival do Japão',
    categories: ['Informativo', 'Notícias'],
    publishedAt: '2025-11-24',
    bodyHtml: `
<p>Publicamos o fomento da Emenda Federal de nº 006346/2024, que tem como cedente o Deputado Federal Kim Kataguiri, para a realização do 26º Festival do Japão.</p>
`.trim(),
  },
] as const;

async function upsertCategory(name: string) {
  const slug = name.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  return prisma.newsCategory.upsert({
    where: { slug },
    update: { name },
    create: { slug, name },
  });
}

async function main() {
  const author = await prisma.user.findFirst({ where: { role: 'webmaster' } });
  if (!author) throw new Error('No webmaster user found — run seed:admin first.');

  for (const n of NEWS) {
    const coverUrl = `${PUBLIC_BASE}/${n.coverPath}`;
    const cats = await Promise.all(n.categories.map(upsertCategory));

    const news = await prisma.news.upsert({
      where: { slug: n.slug },
      update: {
        title: n.title,
        excerpt: n.excerpt,
        bodyHtml: n.bodyHtml,
        coverUrl,
        coverAlt: n.coverAlt,
        status: 'published',
        publishedAt: new Date(`${n.publishedAt}T12:00:00Z`),
      },
      create: {
        slug: n.slug,
        title: n.title,
        excerpt: n.excerpt,
        bodyHtml: n.bodyHtml,
        coverUrl,
        coverAlt: n.coverAlt,
        status: 'published',
        publishedAt: new Date(`${n.publishedAt}T12:00:00Z`),
        authorId: author.id,
      },
    });

    // Sync category links
    await prisma.newsOnCategory.deleteMany({ where: { newsId: news.id } });
    await prisma.newsOnCategory.createMany({
      data: cats.map(c => ({ newsId: news.id, categoryId: c.id })),
      skipDuplicates: true,
    });

    console.log(`✓ ${n.slug} → ${coverUrl}`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
