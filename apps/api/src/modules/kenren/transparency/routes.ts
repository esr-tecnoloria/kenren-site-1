import type { FastifyInstance } from 'fastify';
import { prisma } from '../../../lib/prisma.js';

export async function transparencyRoutes(app: FastifyInstance) {
  app.get('/', async () => {
    const items = await prisma.transparencyProject.findMany({
      where: { status: { not: 'archived' } },
      orderBy: [{ year: 'desc' }, { displayOrder: 'asc' }],
      include: { docs: { orderBy: { displayOrder: 'asc' } } },
    });
    return { items };
  });
}
