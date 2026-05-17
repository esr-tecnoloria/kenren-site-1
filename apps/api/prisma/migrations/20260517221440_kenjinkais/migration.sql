-- CreateTable
CREATE TABLE "kenren"."kenjinkais" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "kanji" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "region_color" TEXT NOT NULL,
    "capital" TEXT NOT NULL,
    "nome_kenjinkai" TEXT,
    "descricao" TEXT,
    "resumo" TEXT,
    "ponto_turistico" TEXT,
    "prato_tipico" TEXT,
    "endereco" TEXT,
    "site" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "cover_url" TEXT,
    "cover_alt" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kenjinkais_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "kenjinkais_slug_key" ON "kenren"."kenjinkais"("slug");

-- CreateIndex
CREATE INDEX "kenjinkais_region_idx" ON "kenren"."kenjinkais"("region");

