import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma.js';

const writeSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  excerpt: z.string().max(500).optional().nullable(),
  bodyHtml: z.string().min(1),
  coverUrl: z.string().url().optional().nullable(),
  coverAlt: z.string().max(300).optional().nullable(),
  youtubeId: z.string().max(50).optional().nullable(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  categoryIds: z.array(z.string().uuid()).default([]),
});

const updateSchema = writeSchema.partial();

export async function adminNewsRoutes(app: FastifyInstance) {
  // All routes require admin role.
  app.addHook('preHandler', app.requireRole(['webmaster', 'content_admin']));

  // List all news (any status), most recent first.
  app.get('/', async () => {
    const news = await prisma.news.findMany({
      orderBy: [{ status: 'asc' }, { updatedAt: 'desc' }],
      include: { categories: { include: { category: true } } },
    });
    return { items: news };
  });

  // Single by id (for editing).
  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const news = await prisma.news.findUnique({
      where: { id: req.params.id },
      include: { categories: { include: { category: true } } },
    });
    if (!news) return reply.notFound();
    return news;
  });

  app.post('/', async (req) => {
    const body = writeSchema.parse(req.body);
    const { categoryIds, ...rest } = body;
    return prisma.news.create({
      data: {
        ...rest,
        authorId: req.user!.id,
        publishedAt: rest.status === 'published' ? new Date() : null,
        categories: { create: categoryIds.map(id => ({ categoryId: id })) },
      },
    });
  });

  app.put<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const body = updateSchema.parse(req.body);
    const existing = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();

    const { categoryIds, status, ...rest } = body;
    const nextStatus = status ?? existing.status;
    const publishedAt =
      nextStatus === 'published' && existing.status !== 'published'
        ? new Date()
        : nextStatus === 'published'
        ? existing.publishedAt
        : null;

    const updated = await prisma.news.update({
      where: { id: req.params.id },
      data: {
        ...rest,
        status: nextStatus,
        publishedAt,
      },
    });

    if (categoryIds) {
      await prisma.newsOnCategory.deleteMany({ where: { newsId: updated.id } });
      if (categoryIds.length > 0) {
        await prisma.newsOnCategory.createMany({
          data: categoryIds.map(cid => ({ newsId: updated.id, categoryId: cid })),
          skipDuplicates: true,
        });
      }
    }

    return updated;
  });

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const existing = await prisma.news.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();
    await prisma.news.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  });
}
