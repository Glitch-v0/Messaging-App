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
      await prisma.friendList.update({
        where: {
          ownerId: userId,
        },
        data: {
          friends: {
            disconnect: {
              id: friendId,
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to unfriend." };
    }
  },
  block: async (userId, blockedId) => {
    try {
      return await prisma.friendList.upsert({
        where: { ownerId: userId },
        update: {
          blocked: { connect: { id: blockedId } },
        },
        create: {
          ownerId: userId,
          blocked: { connect: { id: blockedId } },
        },
      });
    } catch (error) {
      return { error: "Failed to block user." };
    }
  },
};

export default friendQueries;
