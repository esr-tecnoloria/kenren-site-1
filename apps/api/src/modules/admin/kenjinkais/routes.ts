import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma.js';

// The 47 prefectures are fixed — only updates allowed.
const updateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  kanji: z.string().min(1).max(50).optional(),
  region: z.string().min(1).max(50).optional(),
  regionColor: z.string().min(1).max(20).optional(),
  capital: z.string().min(1).max(100).optional(),
  nomeKenjinkai: z.string().max(300).optional().nullable(),
  descricao: z.string().optional().nullable(),
  resumo: z.string().optional().nullable(),
  pontoTuristico: z.string().max(300).optional().nullable(),
  pratoTipico: z.string().max(300).optional().nullable(),
  endereco: z.string().max(500).optional().nullable(),
  site: z.string().url().optional().nullable().or(z.literal('')),
  facebook: z.string().url().optional().nullable().or(z.literal('')),
  instagram: z.string().url().optional().nullable().or(z.literal('')),
  coverUrl: z.string().url().optional().nullable(),
  coverAlt: z.string().max(300).optional().nullable(),
});

export async function adminKenjinkaisRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.requireRole(['webmaster', 'content_admin']));

  app.get('/', async () => {
    const items = await prisma.kenjinkai.findMany({ orderBy: { displayOrder: 'asc' } });
    return { items };
  });

  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const k = await prisma.kenjinkai.findUnique({ where: { id: req.params.id } });
    if (!k) return reply.notFound();
    return k;
  });

  app.put<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const body = updateSchema.parse(req.body);
    const existing = await prisma.kenjinkai.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();
    // Normalize empty strings to null for url fields
    const data: Record<string, unknown> = { ...body };
    for (const k of ['site', 'facebook', 'instagram']) {
      if (data[k] === '') data[k] = null;
    }
    return prisma.kenjinkai.update({ where: { id: req.params.id }, data });
  });
}
