/*
  Warnings:

  - You are about to drop the column `allowRequests` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "allowRequests",
ALTER COLUMN "showOnline" SET DEFAULT true;
