FROM node:20-alpine AS build
WORKDIR /repo

RUN apk add --no-cache openssl \
 && corepack enable && corepack prepare pnpm@8.15.9 --activate

# Workspace root files first (for layer caching).
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json ./
COPY apps/api/package.json apps/api/

# Install only api deps (workspace-aware).
RUN pnpm install --filter @kenren/api --frozen-lockfile

# Copy api source and build.
COPY apps/api ./apps/api
RUN pnpm --filter @kenren/api prisma:generate \
 && pnpm --filter @kenren/api build

FROM node:20-alpine AS runtime
WORKDIR /repo
ENV NODE_ENV=production
RUN apk add --no-cache openssl

COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/apps/api/prisma ./apps/api/prisma
COPY --from=build /repo/apps/api/package.json ./apps/api/

WORKDIR /repo/apps/api
EXPOSE 8080
CMD ["node", "dist/server.js"]
