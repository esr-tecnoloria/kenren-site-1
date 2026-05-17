/**
 * Seeds the transparency projects from the hardcoded data in apps/site/src/pages/TransparenciaPage.jsx.
 * Idempotent by slug.
 *
 * Run: pnpm --filter @kenren/api seed:transparency
 */
import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

type ProjectSeed = {
  slug: string;
  year: number;
  title: string;
  ministry: string;
  sphere: 'Estadual' | 'Federal' | 'Municipal';
  value: number;
  status: 'planned' | 'accounting' | 'executed' | 'archived';
  parliamentarian: string;
  amendment: string;
  agreement: string;
  docs: Array<{ label: string; fileType: string }>;
};

const PROJECTS: ProjectSeed[] = [
  {
    slug: '23-festival-do-japao-2020',
    year: 2020,
    title: '23º Festival do Japão',
    ministry: 'Sec. de Cultura, Economia e Indústria Criativa',
    sphere: 'Estadual',
    value: 250000,
    status: 'executed',
    parliamentarian: 'Marcio Nakashima',
    amendment: 'Emenda Estadual',
    agreement: 'Termo de Fomento Estadual',
    docs: [
      { label: 'Emenda Estadual', fileType: 'PDF' },
      { label: 'Prestação de Contas', fileType: 'PDF' },
      { label: 'Termo de Fomento', fileType: 'PDF' },
    ],
  },
  {
    slug: '24-festival-do-japao-mottanai-2023',
    year: 2023,
    title: '24º Festival do Japão — Mottanai',
    ministry: 'Sec. de Cultura, Economia e Indústria Criativa',
    sphere: 'Estadual',
    value: 300000,
    status: 'executed',
    parliamentarian: 'Marcio Nakashima',
    amendment: 'Emenda Estadual',
    agreement: 'Termo de Fomento Estadual',
    docs: [
      { label: 'Emenda Estadual', fileType: 'PDF' },
      { label: 'Prestação de Contas', fileType: 'PDF' },
      { label: 'Termo de Fomento', fileType: 'PDF' },
    ],
  },
  {
    slug: '25-festival-do-japao-ikigai-2024',
    year: 2024,
    title: '25º Festival do Japão — Ikigai',
    ministry: 'Sec. de Cultura, Economia e Indústria Criativa',
    sphere: 'Estadual',
    value: 300000,
    status: 'executed',
    parliamentarian: 'Marcio Nakashima',
    amendment: 'Emenda Estadual',
    agreement: 'Termo de Fomento Estadual',
    docs: [
      { label: 'Emenda Estadual', fileType: 'PDF' },
      { label: 'Prestação de Contas', fileType: 'PDF' },
      { label: 'Termo de Fomento', fileType: 'PDF' },
    ],
  },
  {
    slug: '26-festival-do-japao-2025-estadual',
    year: 2025,
    title: '26º Festival do Japão (Estadual)',
    ministry: 'Sec. de Cultura, Economia e Indústria Criativa',
    sphere: 'Estadual',
    value: 300000,
    status: 'accounting',
    parliamentarian: 'Marcio Nakashima',
    amendment: 'Emenda Estadual',
    agreement: 'Termo de Fomento Estadual',
    docs: [
      { label: 'Emenda Estadual', fileType: 'PDF' },
      { label: 'Termo de Fomento', fileType: 'PDF' },
    ],
  },
  {
    slug: '26-festival-do-japao-2025-federal',
    year: 2025,
    title: '26º Festival do Japão (Federal)',
    ministry: 'Ministério da Cultura',
    sphere: 'Federal',
    value: 500000,
    status: 'accounting',
    parliamentarian: 'Kim Kataguiri',
    amendment: 'Emenda Federal',
    agreement: 'Termo de Fomento Federal',
    docs: [
      { label: 'Emenda Federal', fileType: 'PDF' },
      { label: 'Termo de Fomento', fileType: 'PDF' },
    ],
  },
];

async function main() {
  for (let i = 0; i < PROJECTS.length; i++) {
    const p = PROJECTS[i]!;
    const project = await prisma.transparencyProject.upsert({
      where: { slug: p.slug },
      update: {
        year: p.year,
        title: p.title,
        ministry: p.ministry,
        sphere: p.sphere,
        value: p.value,
        status: p.status,
        parliamentarian: p.parliamentarian,
        amendment: p.amendment,
        agreement: p.agreement,
        displayOrder: i,
      },
      create: {
        slug: p.slug,
        year: p.year,
        title: p.title,
        ministry: p.ministry,
        sphere: p.sphere,
        value: p.value,
        status: p.status,
        parliamentarian: p.parliamentarian,
        amendment: p.amendment,
        agreement: p.agreement,
        displayOrder: i,
      },
    });

    // Sync docs: wipe and recreate to match seed list
    await prisma.projectDoc.deleteMany({ where: { projectId: project.id } });
    await prisma.projectDoc.createMany({
      data: p.docs.map((d, idx) => ({
        projectId: project.id,
        label: d.label,
        fileType: d.fileType,
        displayOrder: idx,
      })),
    });

    console.log(`✓ ${p.slug} (${p.docs.length} docs)`);
  }
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
