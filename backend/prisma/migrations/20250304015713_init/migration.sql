/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "conversationId";

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_id_fkey" FOREIGN KEY ("id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
