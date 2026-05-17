import type { FastifyInstance } from 'fastify';
import { prisma } from '../../../lib/prisma.js';

export async function newsCategoriesPublicRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const items = await prisma.newsCategory.findMany({ orderBy: { name: 'asc' } });
    return { items };
  });
}
