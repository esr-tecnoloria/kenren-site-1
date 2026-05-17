import type { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../../../lib/prisma.js';

const docSchema = z.object({
  label: z.string().min(1).max(200),
  url: z.string().url().optional().nullable(),
  fileType: z.string().max(20).optional().nullable(),
});

const writeSchema = z.object({
  slug: z.string().min(1).max(200),
  year: z.coerce.number().int().min(1900).max(2100),
  title: z.string().min(1).max(300),
  ministry: z.string().max(300).optional().nullable(),
  sphere: z.enum(['Estadual', 'Federal', 'Municipal']),
  value: z.coerce.number().nonnegative(),
  status: z.enum(['planned', 'accounting', 'executed', 'archived']).default('planned'),
  parliamentarian: z.string().max(300).optional().nullable(),
  amendment: z.string().max(200).optional().nullable(),
  agreement: z.string().max(200).optional().nullable(),
  notes: z.string().optional().nullable(),
  displayOrder: z.coerce.number().int().default(0),
  docs: z.array(docSchema).default([]),
});

const updateSchema = writeSchema.partial();

export async function adminTransparencyRoutes(app: FastifyInstance) {
  app.addHook('preHandler', app.requireRole(['webmaster', 'content_admin']));

  app.get('/', async () => {
    const items = await prisma.transparencyProject.findMany({
      orderBy: [{ year: 'desc' }, { displayOrder: 'asc' }],
      include: { docs: { orderBy: { displayOrder: 'asc' } } },
    });
    return { items };
  });

  app.get<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const item = await prisma.transparencyProject.findUnique({
      where: { id: req.params.id },
      include: { docs: { orderBy: { displayOrder: 'asc' } } },
    });
    if (!item) return reply.notFound();
    return item;
  });

  app.post('/', async (req) => {
    const body = writeSchema.parse(req.body);
    const { docs, ...rest } = body;
    return prisma.transparencyProject.create({
      data: {
        ...rest,
        docs: { create: docs.map((d, i) => ({ ...d, displayOrder: i })) },
      },
      include: { docs: true },
    });
  });

  app.put<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const body = updateSchema.parse(req.body);
    const existing = await prisma.transparencyProject.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();

    const { docs, ...rest } = body;
    const updated = await prisma.transparencyProject.update({
      where: { id: req.params.id },
      data: rest,
    });

    // Replace docs if provided (full sync)
    if (docs !== undefined) {
      await prisma.projectDoc.deleteMany({ where: { projectId: updated.id } });
      if (docs.length > 0) {
        await prisma.projectDoc.createMany({
          data: docs.map((d, i) => ({ ...d, projectId: updated.id, displayOrder: i })),
        });
      }
    }

    return prisma.transparencyProject.findUnique({
      where: { id: updated.id },
      include: { docs: { orderBy: { displayOrder: 'asc' } } },
    });
  });

  app.delete<{ Params: { id: string } }>('/:id', async (req, reply) => {
    const existing = await prisma.transparencyProject.findUnique({ where: { id: req.params.id } });
    if (!existing) return reply.notFound();
    await prisma.transparencyProject.delete({ where: { id: req.params.id } });
    return reply.code(204).send();
  });
}
