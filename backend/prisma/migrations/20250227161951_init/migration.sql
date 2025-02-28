-- DropForeignKey
ALTER TABLE "FriendList" DROP CONSTRAINT "FriendList_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "FriendList" ADD CONSTRAINT "FriendList_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
