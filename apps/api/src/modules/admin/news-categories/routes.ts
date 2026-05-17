import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma.js';

const writeSchema = z.object({
  slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/, 'Use apenas letras minúsculas, números e hífen'),
  name: z.string().min(1).max(100),
});

export async function adminNewsCategoriesRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.requireRole(['webmaster', 'content_admin']));

  app.get('/', async () => {
    const items = await prisma.newsCategory.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { news: true } } },
    });
    return { items: items.map(c => ({ id: c.id, slug: c.slug, name: c.name, newsCount: c._count.news })) };
  });

  app.post('/', async (req) => {
    const body = writeSchema.parse(req.body);
    return prisma.newsCategory.create({ data: body });
  });

  app.put<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const body = writeSchema.parse(req.body);
    const existing = await prisma.newsCategory.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();
    return prisma.newsCategory.update({ where: { id: req.params.id }, data: body });
  });

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const existing = await prisma.newsCategory.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();
    await prisma.newsCategory.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  });
}
