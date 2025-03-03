/*
  Warnings:

  - You are about to drop the `_Conversations` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `conversationId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_id_fkey";

-- DropForeignKey
ALTER TABLE "_Conversations" DROP CONSTRAINT "_Conversations_A_fkey";

-- DropForeignKey
ALTER TABLE "_Conversations" DROP CONSTRAINT "_Conversations_B_fkey";

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "conversationId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "darkMode" DROP DEFAULT,
ALTER COLUMN "showOnline" DROP DEFAULT,
ALTER COLUMN "allowRequests" DROP DEFAULT;

-- DropTable
DROP TABLE "_Conversations";

-- CreateTable
CREATE TABLE "_ConversationToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ConversationToUser_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ConversationToUser_B_index" ON "_ConversationToUser"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToUser" ADD CONSTRAINT "_ConversationToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConversationToUser" ADD CONSTRAINT "_ConversationToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
