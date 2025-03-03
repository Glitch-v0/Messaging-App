/*
  Warnings:

  - You are about to drop the column `conversationId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the `_ConversationToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_conversationId_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToUser" DROP CONSTRAINT "_ConversationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ConversationToUser" DROP CONSTRAINT "_ConversationToUser_B_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "conversationId";

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "darkMode" SET DEFAULT false,
ALTER COLUMN "showOnline" SET DEFAULT false,
ALTER COLUMN "allowRequests" SET DEFAULT false;

-- DropTable
DROP TABLE "_ConversationToUser";

-- CreateTable
CREATE TABLE "_Conversations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_Conversations_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_Conversations_B_index" ON "_Conversations"("B");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_id_fkey" FOREIGN KEY ("id") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Conversations" ADD CONSTRAINT "_Conversations_A_fkey" FOREIGN KEY ("A") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Conversations" ADD CONSTRAINT "_Conversations_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
