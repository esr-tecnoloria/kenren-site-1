import type { FastifyInstance, FastifyRequest } from 'fastify';
import fp from 'fastify-plugin';
import { firebaseAuth } from '../lib/firebase.js';
import { prisma } from '../lib/prisma.js';
import type { Role } from '@prisma/client';

declare module 'fastify' {
  interface FastifyRequest {
    user?: {
      id: string;
      firebaseUid: string;
      email: string;
      role: Role;
    };
  }
}

async function authenticate(req: FastifyRequest) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw req.server.httpErrors.unauthorized('Missing bearer token');
  }
  const token = header.slice('Bearer '.length).trim();

  let decoded;
  try {
    decoded = await firebaseAuth.verifyIdToken(token);
  } catch {
    throw req.server.httpErrors.unauthorized('Invalid token');
  }

  const user = await prisma.user.findUnique({ where: { firebaseUid: decoded.uid } });
  if (!user || !user.active) {
    throw req.server.httpErrors.forbidden('User not provisioned');
  }
  req.user = {
    id: user.id,
    firebaseUid: user.firebaseUid,
    email: user.email,
    role: user.role,
  };
}

export const authPlugin = fp(async (app: FastifyInstance) => {
  app.decorate('authenticate', authenticate);
  app.decorate('requireRole', (allowed: Role[]) => async (req: FastifyRequest) => {
    await authenticate(req);
    if (!req.user || !allowed.includes(req.user.role)) {
      throw req.server.httpErrors.forbidden('Insufficient role');
    }
  });
});

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest) => Promise<void>;
    requireRole: (allowed: Role[]) => (req: FastifyRequest) => Promise<void>;
  }
}
