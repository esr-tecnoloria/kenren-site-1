import type { FastifyInstance } from 'fastify';
import { prisma } from '../../../lib/prisma.js';

// Public-facing read routes for events. Only published items are exposed.
export async function eventsRoutes(app: FastifyInstance) {
  // Upcoming events sorted ascending by starts_at; past events excluded by default.
  app.get<{ Querystring: { past?: string; limit?: string } }>('/', async (req) => {
    const limit = Math.min(Number(req.query.limit ?? 50), 200);
    const includePast = req.query.past === '1';
    const items = await prisma.event.findMany({
      where: {
        status: 'published',
        ...(includePast ? {} : { startsAt: { gte: new Date(Date.now() - 1000 * 60 * 60 * 12) } }),
      },
      orderBy: { startsAt: 'asc' },
      take: limit,
    });
    return { items };
  });

  app.get<{ Params: { slug: string } }>('/:slug', async (req, reply) => {
    const ev = await prisma.event.findUnique({ where: { slug: req.params.slug } });
    if (!ev || ev.status !== 'published') return reply.notFound('Evento não encontrado');
    return ev;
  });
}
