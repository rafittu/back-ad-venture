-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('ACTIVE', 'PAUSED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "CampaignCategory" AS ENUM ('PROMOTION', 'DISCOUNT', 'BRAND_ENGAGEMENT', 'CUSTOMER_ACQUISITION', 'CUSTOMER_RETENTION', 'EVENTS', 'SEASONAL', 'EDUCATIONAL', 'CONTENT_MARKETING', 'SOCIAL_RESPONSIBILITY');

-- CreateTable
CREATE TABLE "Campaign" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "category" "CampaignCategory" NOT NULL,
    "status" "CampaignStatus" NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Campaign_id_key" ON "Campaign"("id");
