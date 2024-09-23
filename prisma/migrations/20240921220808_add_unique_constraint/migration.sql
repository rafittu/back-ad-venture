/*
  Warnings:

  - A unique constraint covering the columns `[name,category,status]` on the table `Campaign` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Campaign_name_category_status_key" ON "Campaign"("name", "category", "status");
