/**
 * Seeds the 47 kenjinkais from apps/site/src/data/prefectures.js into kenren.kenjinkais.
 * Idempotent by slug. Re-running updates editorial fields but does not overwrite cover_url.
 *
 * Run: pnpm --filter @kenren/api seed:kenjinkais
 */
import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { prisma } from '../src/lib/prisma.js';

// Read prefectures.js as text and extract the data via a sandboxed eval-like approach.
// Simpler: import via dynamic import after rewriting? We're in TS/ESM — and prefectures.js
// uses ESM `export const`. We can dynamic-import it directly with the file:// scheme.
async function loadPrefectures(): Promise<Record<string, any>> {
  const file = resolve(process.cwd(), '../site/src/data/prefectures.js');
  // Sanity check the file exists
  readFileSync(file, 'utf8');
  // file:// import via tsx is supported
  const mod = await import(`file://${file}`);
  return mod.prefectureData as Record<string, any>;
}

// Display order: roughly geographic (north to south) — matches REGIONS order used by JapanMap.
const ORDER = [
  'hokkaido',
  'aomori','iwate','miyagi','akita','yamagata','fukushima',
  'ibaraki','tochigi','gunma','saitama','chiba','tokyo','kanagawa',
  'niigata','toyama','ishikawa','fukui','yamanashi','nagano','gifu','shizuoka','aichi',
  'mie','shiga','kyoto','osaka','hyogo','nara','wakayama',
  'tottori','shimane','okayama','hiroshima','yamaguchi',
  'tokushima','kagawa','ehime','kochi',
  'fukuoka','saga','nagasaki','kumamoto','oita','miyazaki','kagoshima','okinawa',
];

async function main() {
  const data = await loadPrefectures();

  let count = 0;
  for (const slug of ORDER) {
    const p = data[slug];
    if (!p) {
      console.warn(`! ${slug} not found in prefectures.js — skipping`);
      continue;
    }
    await prisma.kenjinkai.upsert({
      where: { slug },
      update: {
        name: p.name,
        kanji: p.kanji,
        region: p.region,
        regionColor: p.regionColor,
        capital: p.capital,
        nomeKenjinkai: p.nomeKenjinkai ?? null,
        descricao: p.desc ?? null,
        resumo: p.resumo ?? null,
        pontoTuristico: p.pontoTuristico ?? null,
        pratoTipico: p.pratoTipico ?? null,
        endereco: p.endereco ?? null,
        site: p.site ?? null,
        facebook: p.facebook ?? null,
        instagram: p.instagram ?? null,
        displayOrder: ORDER.indexOf(slug),
      },
      create: {
        slug,
        name: p.name,
        kanji: p.kanji,
        region: p.region,
        regionColor: p.regionColor,
        capital: p.capital,
        nomeKenjinkai: p.nomeKenjinkai ?? null,
        descricao: p.desc ?? null,
        resumo: p.resumo ?? null,
        pontoTuristico: p.pontoTuristico ?? null,
        pratoTipico: p.pratoTipico ?? null,
        endereco: p.endereco ?? null,
        site: p.site ?? null,
        facebook: p.facebook ?? null,
        instagram: p.instagram ?? null,
        displayOrder: ORDER.indexOf(slug),
      },
    });
    count++;
  }
  console.log(`✓ ${count} kenjinkais sincronizados`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
