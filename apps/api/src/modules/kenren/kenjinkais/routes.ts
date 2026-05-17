import type { FastifyInstance } from 'fastify';
import { prisma } from '../../../lib/prisma.js';

export async function kenjinkaisRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const items = await prisma.kenjinkai.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return { items };
  });

  app.get<{ Params: { slug: string } }>('/:slug', async (req, reply) => {
    const k = await prisma.kenjinkai.findUnique({ where: { slug: req.params.slug } });
    if (!k) return reply.notFound('Kenjinkai não encontrado');
    return k;
  });
}
