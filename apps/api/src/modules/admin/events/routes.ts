import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma.js';

const writeSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(300),
  description: z.string().max(500).optional().nullable(),
  bodyHtml: z.string().optional().nullable(),
  location: z.string().max(500).optional().nullable(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime().optional().nullable(),
  allDay: z.boolean().default(false),
  coverUrl: z.string().url().optional().nullable(),
  coverAlt: z.string().max(300).optional().nullable(),
  linkUrl: z.string().url().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
});

const updateSchema = writeSchema.partial();

export async function adminEventsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.requireRole(['webmaster', 'content_admin']));

  app.get('/', async () => {
    const items = await prisma.event.findMany({
      orderBy: [{ startsAt: 'desc' }],
    });
    return { items };
  });

  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const ev = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!ev) return reply.notFound();
    return ev;
  });

  app.post('/', async (req) => {
    const body = writeSchema.parse(req.body);
    return prisma.event.create({
      data: {
        ...body,
        startsAt: new Date(body.startsAt),
        endsAt: body.endsAt ? new Date(body.endsAt) : null,
        publishedAt: body.status === 'published' ? new Date() : null,
      },
    });
  });

  app.put<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const body = updateSchema.parse(req.body);
    const existing = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();

    const nextStatus = body.status ?? existing.status;
    const publishedAt =
      nextStatus === 'published' && existing.status !== 'published'
        ? new Date()
        : nextStatus === 'published'
        ? existing.publishedAt
        : null;

    return prisma.event.update({
      where: { id: req.params.id },
      data: {
        ...body,
        startsAt: body.startsAt ? new Date(body.startsAt) : undefined,
        endsAt: body.endsAt === null ? null : body.endsAt ? new Date(body.endsAt) : undefined,
        status: nextStatus,
        publishedAt,
      },
    });
  });

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const existing = await prisma.event.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();
    await prisma.event.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  });
}
