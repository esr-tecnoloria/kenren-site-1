-- CreateTable
CREATE TABLE "kenren"."hero_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "cta_label" TEXT,
    "cta_href" TEXT,
    "show_logo" BOOLEAN NOT NULL DEFAULT true,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kenren"."hero_slides" (
    "id" UUID NOT NULL,
    "image_url" TEXT NOT NULL,
    "alt" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "hero_slides_active_display_order_idx" ON "kenren"."hero_slides"("active", "display_order");

