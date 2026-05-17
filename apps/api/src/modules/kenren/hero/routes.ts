import type { FastifyInstance } from 'fastify';
import { prisma } from '../../../lib/prisma.js';

export async function heroPublicRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const [settings, slides] = await Promise.all([
      prisma.heroSettings.findUnique({ where: { id: 1 } }),
      prisma.heroSlide.findMany({
        where: { active: true },
        orderBy: { displayOrder: 'asc' },
      }),
    ]);
    return { settings: settings ?? null, slides };
  });
}
