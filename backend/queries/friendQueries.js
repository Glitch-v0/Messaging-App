import prisma from "../prisma/prisma.js";

const friendQueries = {
  getFriends: async (userId) => {
    try {
      return await prisma.friendList.findUnique({
        where: {
          ownerId: userId,
        },
        select: {
          friends: {
            select: {
              id: true,
              name: true,
            },
          },
          blocked: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve friend list." };
    }
  },

  getFriend: async (userId, friendId) => {
    try {
      return await prisma.friendList.findUnique({
        where: {
          ownerId: userId,
        },
        select: {
          friends: {
            where: {
              id: friendId,
            },
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve friend." };
    }
  },
  unfriend: async (userId, friendId) => {
    try {
      return await prisma.$transaction([
        prisma.friendList.update({
          where: { ownerId: userId },
          data: { friends: { disconnect: { id: friendId } } },
        }),
        prisma.friendList.update({
          where: { ownerId: friendId },
          data: { friends: { disconnect: { id: userId } } },
        }),
      ]);
    } catch (error) {
      return { error: "Failed to unfriend." };
    }
  },
  block: async (userId, blockedId) => {
    try {
      return await prisma.$transaction([
        // Remove userId from blockedId's friends (if exists)
        prisma.friendList.update({
          where: { ownerId: blockedId },
          data: { friends: { disconnect: { id: userId } } },
        }),
        // Remove blockedId from userId's friends + add to blocklist
        prisma.friendList.update({
          where: { ownerId: userId },
          data: {
            friends: { disconnect: { id: blockedId } },
            blocked: { connect: { id: blockedId } },
          },
        }),
      ]);
    } catch (error) {
      return { error: "Failed to block user." };
    }
  },
};

export default friendQueries;
