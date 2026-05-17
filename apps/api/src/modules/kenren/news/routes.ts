import type { FastifyInstance } from 'fastify';
import { prisma } from '../../../lib/prisma.js';

// Public-facing read routes for news. Only published items are exposed.
// Admin CRUD lives in /admin/news.
export async function newsRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const news = await prisma.news.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      include: { categories: { include: { category: true } } },
      take: 100,
    });
    return { items: news };
  });

  app.get<{ Params: { slug: string } }>('/:slug', async (req, reply) => {
    const news = await prisma.news.findUnique({
      where: { slug: req.params.slug },
      include: { categories: { include: { category: true } }, author: { select: { displayName: true } } },
    });
    if (!news || news.status !== 'published') return reply.notFound('Notícia não encontrada');
    return news;
  });
}
