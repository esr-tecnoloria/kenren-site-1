import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import sensible from '@fastify/sensible';
import { env, corsOrigins } from './lib/env.js';
import { authPlugin } from './plugins/auth.js';
import { newsRoutes } from './modules/kenren/news/routes.js';
import { eventsRoutes } from './modules/kenren/events/routes.js';
import { kenjinkaisRoutes } from './modules/kenren/kenjinkais/routes.js';
import { newsCategoriesPublicRoutes } from './modules/kenren/news-categories/routes.js';
import { transparencyRoutes } from './modules/kenren/transparency/routes.js';
import { heroPublicRoutes } from './modules/kenren/hero/routes.js';
import { adminNewsRoutes } from './modules/admin/news/routes.js';
import { adminEventsRoutes } from './modules/admin/events/routes.js';
import { adminKenjinkaisRoutes } from './modules/admin/kenjinkais/routes.js';
import { adminNewsCategoriesRoutes } from './modules/admin/news-categories/routes.js';
import { adminTransparencyRoutes } from './modules/admin/transparency/routes.js';
import { adminHeroRoutes } from './modules/admin/hero/routes.js';
import { mediaRoutes } from './modules/shared/media/routes.js';

const app = Fastify({
  logger: {
    level: env.LOG_LEVEL,
    transport: env.NODE_ENV === 'development'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
  },
});

await app.register(sensible);
await app.register(cors, {
  origin: corsOrigins.length ? corsOrigins : true,
  credentials: true,
});
await app.register(authPlugin);

app.get('/health', async () => ({ ok: true, env: env.NODE_ENV }));

await app.register(newsRoutes, { prefix: '/kenren/news' });
await app.register(eventsRoutes, { prefix: '/kenren/events' });
await app.register(kenjinkaisRoutes, { prefix: '/kenren/kenjinkais' });
await app.register(newsCategoriesPublicRoutes, { prefix: '/kenren/news-categories' });
await app.register(transparencyRoutes, { prefix: '/kenren/transparency' });
await app.register(heroPublicRoutes, { prefix: '/kenren/hero' });
await app.register(adminNewsRoutes, { prefix: '/admin/news' });
await app.register(adminEventsRoutes, { prefix: '/admin/events' });
await app.register(adminKenjinkaisRoutes, { prefix: '/admin/kenjinkais' });
await app.register(adminNewsCategoriesRoutes, { prefix: '/admin/news-categories' });
await app.register(adminTransparencyRoutes, { prefix: '/admin/transparency' });
await app.register(adminHeroRoutes, { prefix: '/admin/hero' });
await app.register(mediaRoutes, { prefix: '/media' });

try {
  await app.listen({ port: env.PORT, host: '0.0.0.0' });
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
