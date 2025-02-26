/*
  Warnings:

  - You are about to drop the column `dateSent` on the `Request` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reaction" ALTER COLUMN "id" DROP DEFAULT;
DROP SEQUENCE "reaction_id_seq";

-- AlterTable
ALTER TABLE "Request" DROP COLUMN "dateSent";
