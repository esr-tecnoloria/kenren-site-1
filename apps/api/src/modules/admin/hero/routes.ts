import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma.js';

const settingsSchema = z.object({
  title: z.string().max(200).optional().nullable(),
  subtitle: z.string().max(500).optional().nullable(),
  description: z.string().max(2000).optional().nullable(),
  ctaLabel: z.string().max(100).optional().nullable(),
  ctaHref: z.string().max(500).optional().nullable(),
  showLogo: z.boolean().optional(),
});

const slideWrite = z.object({
  imageUrl: z.string().url(),
  alt: z.string().max(300).optional().nullable(),
  active: z.boolean().default(true),
  displayOrder: z.coerce.number().int().default(0),
});

const slideUpdate = slideWrite.partial();

export async function adminHeroRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.requireRole(['webmaster', 'content_admin']));

  // Full hero state
  app.get('/', async () => {
    const [settings, slides] = await Promise.all([
      prisma.heroSettings.findUnique({ where: { id: 1 } }),
      prisma.heroSlide.findMany({ orderBy: { displayOrder: 'asc' } }),
    ]);
    return { settings: settings ?? null, slides };
  });

  app.put('/settings', async (req) => {
    const body = settingsSchema.parse(req.body);
    return prisma.heroSettings.upsert({
      where: { id: 1 },
      update: body,
      create: { id: 1, ...body },
    });
  });

  app.post('/slides', async (req) => {
    const body = slideWrite.parse(req.body);
    return prisma.heroSlide.create({ data: body });
  });

  app.put<{ Params: { id: string } }>('/slides/:id', async (req, reply) => {
    const body = slideUpdate.parse(req.body);
    const existing = await prisma.heroSlide.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();
    return prisma.heroSlide.update({ where: { id: req.params.id }, data: body });
  });

  app.delete<{ Params: { id: string } }>('/slides/:id', async (req, reply) => {
    const existing = await prisma.heroSlide.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();
    await prisma.heroSlide.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  });

  // Reorder helper — accepts an ordered array of slide IDs.
  app.put<{ Body: { ids: string[] } }>('/slides/reorder', async (req, reply) => {
    const ids = z.object({ ids: z.array(z.string().uuid()) }).parse(req.body).ids;
    await prisma.$transaction(
      ids.map((id, idx) => prisma.heroSlide.update({ where: { id }, data: { displayOrder: idx } })),
    );
    return reply.code(204).send();
  });
}
