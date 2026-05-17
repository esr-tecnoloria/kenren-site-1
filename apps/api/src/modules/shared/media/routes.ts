import type { FastifyInstance } from 'fastify';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { signUploadUrl } from '../../../lib/gcs.js';
import { env } from '../../../lib/env.js';

const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml',
  'application/pdf',
]);

const signSchema = z.object({
  filename: z.string().min(1).max(200),
  contentType: z.string().min(1),
  folder: z.enum(['news', 'events', 'kenjinkais', 'transparencia', 'hero', 'other']).default('other'),
});

function sanitize(name: string) {
  return name
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-zA-Z0-9._-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 100);
}

export async function mediaRoutes(app: FastifyInstance) {
  // Admin: get a signed URL to upload one file directly to GCS.
  app.post(
    '/sign-upload',
    { preHandler: app.requireRole(['webmaster', 'content_admin']) },
    async (req, reply) => {
      const body = signSchema.parse(req.body);
      if (!ALLOWED_MIME.has(body.contentType)) {
        return reply.badRequest(`Tipo não permitido: ${body.contentType}`);
      }
      const safe = sanitize(body.filename);
      const gcsPath = `${body.folder}/${Date.now()}-${randomUUID().slice(0, 8)}-${safe}`;
      const uploadUrl = await signUploadUrl({
        path: gcsPath,
        contentType: body.contentType,
        expiresInMinutes: 10,
      });
      const publicUrl = `https://storage.googleapis.com/${env.GCS_BUCKET}/${gcsPath}`;
      return { uploadUrl, gcsPath, publicUrl };
    },
  );
}
