-- CreateTable
CREATE TABLE "kenren"."events" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "body_html" TEXT,
    "location" TEXT,
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3),
    "all_day" BOOLEAN NOT NULL DEFAULT false,
    "cover_url" TEXT,
    "cover_alt" TEXT,
    "link_url" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "kenren"."PublishStatus" NOT NULL DEFAULT 'draft',
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "kenren"."events"("slug");

-- CreateIndex
CREATE INDEX "events_status_starts_at_idx" ON "kenren"."events"("status", "starts_at");

