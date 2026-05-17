-- CreateEnum
CREATE TYPE "kenren"."ProjectStatus" AS ENUM ('planned', 'accounting', 'executed', 'archived');

-- CreateTable
CREATE TABLE "kenren"."transparency_projects" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "ministry" TEXT,
    "sphere" TEXT NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "status" "kenren"."ProjectStatus" NOT NULL DEFAULT 'planned',
    "parliamentarian" TEXT,
    "amendment" TEXT,
    "agreement" TEXT,
    "notes" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transparency_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kenren"."transparency_project_docs" (
    "id" UUID NOT NULL,
    "project_id" UUID NOT NULL,
    "label" TEXT NOT NULL,
    "url" TEXT,
    "file_type" TEXT,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transparency_project_docs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "transparency_projects_slug_key" ON "kenren"."transparency_projects"("slug");

-- CreateIndex
CREATE INDEX "transparency_projects_year_display_order_idx" ON "kenren"."transparency_projects"("year", "display_order");

-- AddForeignKey
ALTER TABLE "kenren"."transparency_project_docs" ADD CONSTRAINT "transparency_project_docs_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "kenren"."transparency_projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

