import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma.js';

const createNewsSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().optional(),
  bodyHtml: z.string().min(1),
  coverUrl: z.string().url().optional(),
  coverAlt: z.string().optional(),
  youtubeId: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  categoryIds: z.array(z.string().uuid()).default([]),
});

export async function newsRoutes(app: FastifyInstance) {
  // Public: list published news
  app.get('/', async (req) => {
    const news = await prisma.news.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      include: { categories: { include: { category: true } } },
      take: 50,
    });
    return { items: news };
  });

  // Admin: create
  app.post('/', { preHandler: app.requireRole(['webmaster', 'content_admin']) }, async (req) => {
    const body = createNewsSchema.parse(req.body);
    const { categoryIds, ...rest } = body;
    const news = await prisma.news.create({
      data: {
        ...rest,
        authorId: req.user!.id,
        publishedAt: rest.status === 'published' ? new Date() : null,
        categories: { create: categoryIds.map(id => ({ categoryId: id })) },
      },
    });
    return news;
  });
}
