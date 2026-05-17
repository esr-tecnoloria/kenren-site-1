/**
 * Seeds initial hero settings and slides from the original hardcoded values.
 * Idempotent: re-running updates the single settings row and adds missing slides.
 *
 * Run: pnpm --filter @kenren/api seed:hero
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const DEFAULT_SLIDES = [
  { imageUrl: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1920&q=90', alt: 'Templo Japonês' },
  { imageUrl: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=1920&q=90',     alt: 'Cerejeiras do Japão' },
  { imageUrl: 'https://images.unsplash.com/photo-1528164344705-47542687000d?w=1920&q=90',  alt: 'Monte Fuji' },
];

async function main() {
  await prisma.heroSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      subtitle: 'Federação das Associações de Províncias do Japão no Brasil',
      description: 'Fundada em 1966, a KENREN é uma entidade que visa incentivar e apoiar os emigrantes japoneses, preservar e divulgar a cultura japonesa, fortalecer os kenjinkais das 47 províncias.',
      ctaLabel: 'Saiba Mais',
      ctaHref: '#federacao',
      showLogo: true,
    },
  });
  console.log('✓ hero_settings');

  const existing = await prisma.heroSlide.count();
  if (existing > 0) {
    console.log(`(skipping slides: ${existing} already exist)`);
  } else {
    for (let i = 0; i < DEFAULT_SLIDES.length; i++) {
      const s = DEFAULT_SLIDES[i]!;
      await prisma.heroSlide.create({
        data: { imageUrl: s.imageUrl, alt: s.alt, displayOrder: i, active: true },
      });
      console.log(`✓ slide ${i + 1} — ${s.alt}`);
    }
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
