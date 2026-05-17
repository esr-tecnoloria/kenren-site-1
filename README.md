# Kenren

Federação das Associações de Províncias do Japão no Brasil.

Monorepo com site público, painel admin e API.

## Apps

| App | Stack | URL produção |
|---|---|---|
| [apps/site](apps/site) | React + Vite + React Router | https://kenren.web.app |
| [apps/admin](apps/admin) | React + Vite + Firebase Auth + TinyMCE | https://kenren-admin.web.app |
| [apps/api](apps/api) | Fastify + Prisma + Cloud SQL | https://kenren-api-mvxj6ljnkq-rj.a.run.app |

## Infra (GCP / Firebase)

- **Cloud SQL Postgres 15** instância `kenren-db` (southamerica-east1), schemas `shared` + `kenren` em `kenren_main`
- **Cloud Run** serviço `kenren-api`, deploy via Cloud Build
- **Firebase Hosting** sites `kenren` e `kenren-admin`
- **GCS** bucket `kenren-media` (público), imagens via signed upload URL
- **Storage Resize Images** extension gera variants 400/800/1600
- **Firebase Auth** + Google provider para o admin
- **Workload Identity Federation** liga GitHub Actions ao GCP (sem chave estática)

## Dev local

Requer Node 20+, pnpm 8.15+, `gcloud` autenticado e `cloud-sql-proxy`.

```bash
pnpm install

# Site
pnpm dev:site                       # http://localhost:5173

# Admin (precisa apps/admin/.env com Firebase web config)
pnpm --filter @kenren/admin dev      # http://localhost:5174

# API (em outra aba: cloud-sql-proxy)
pnpm --filter @kenren/api dev:proxy
# então
pnpm --filter @kenren/api dev        # http://localhost:8080
```

## Deploy

Push em `main` dispara [.github/workflows/deploy.yml](.github/workflows/deploy.yml) que detecta o que mudou e faz deploy:
- `apps/api/**` → Cloud Build → Cloud Run
- `apps/site/**` ou `apps/admin/**` → build local → Firebase Hosting

PRs ganham preview channels via [.github/workflows/pr-preview.yml](.github/workflows/pr-preview.yml).

## Estrutura

```
apps/
  api/       Fastify + Prisma + scripts de seed
  site/      site público
  admin/     painel admin
extensions/  config das Firebase Extensions
.github/
  workflows/ CI/CD
```
