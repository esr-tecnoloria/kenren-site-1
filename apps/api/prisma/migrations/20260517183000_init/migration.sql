-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "kenren";

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "shared";

-- CreateEnum
CREATE TYPE "shared"."Role" AS ENUM ('webmaster', 'content_admin', 'kenren_member');

-- CreateEnum
CREATE TYPE "kenren"."PublishStatus" AS ENUM ('draft', 'published', 'archived');

-- CreateTable
CREATE TABLE "shared"."users" (
    "id" UUID NOT NULL,
    "firebase_uid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "display_name" TEXT,
    "role" "shared"."Role" NOT NULL DEFAULT 'content_admin',
    "active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kenren"."news_categories" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kenren"."news" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "body_html" TEXT NOT NULL,
    "cover_url" TEXT,
    "cover_alt" TEXT,
    "youtube_id" TEXT,
    "status" "kenren"."PublishStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "author_id" UUID NOT NULL,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kenren"."news_on_categories" (
    "news_id" UUID NOT NULL,
    "category_id" UUID NOT NULL,

    CONSTRAINT "news_on_categories_pkey" PRIMARY KEY ("news_id","category_id")
);

-- CreateTable
CREATE TABLE "kenren"."media" (
    "id" UUID NOT NULL,
    "gcs_path" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "size_bytes" INTEGER NOT NULL,
    "alt" TEXT,
    "uploaded_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_firebase_uid_key" ON "shared"."users"("firebase_uid");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "shared"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "news_categories_slug_key" ON "kenren"."news_categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "news_slug_key" ON "kenren"."news"("slug");

-- CreateIndex
CREATE INDEX "news_status_published_at_idx" ON "kenren"."news"("status", "published_at");

-- CreateIndex
CREATE UNIQUE INDEX "media_gcs_path_key" ON "kenren"."media"("gcs_path");

-- AddForeignKey
ALTER TABLE "kenren"."news" ADD CONSTRAINT "news_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "shared"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kenren"."news_on_categories" ADD CONSTRAINT "news_on_categories_news_id_fkey" FOREIGN KEY ("news_id") REFERENCES "kenren"."news"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kenren"."news_on_categories" ADD CONSTRAINT "news_on_categories_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "kenren"."news_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kenren"."media" ADD CONSTRAINT "media_uploaded_by_id_fkey" FOREIGN KEY ("uploaded_by_id") REFERENCES "shared"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

