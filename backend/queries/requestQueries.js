import prisma from "../prisma/prisma.js";

const requestQueries = {
  getAllRequests: async (userId) => {
    return await prisma.$transaction(async (prisma) => {
      //get Blocked list
      const blocked = await prisma.friendList.findMany({
        where: {
          ownerId: userId,
        },
        select: {
          blocked: {
            select: {
              id: true,
            },
          },
        },
      });

      const blockedUserIds = blocked.flatMap((entry) =>
        entry.blocked.map((user) => user.id)
      );

      // Get requests from users not on block list
      return await prisma.request.findMany({
        where: {
          receiverId: userId,
          senderId: {
            notIn: blockedUserIds,
          },
        },
      });
    });
  },
  getSingleRequest: async (requestId) => {
    return await prisma.request.findUnique({
      where: {
        id: requestId,
      },
    });
  },
  getSentRequests: async (userId) => {
    return await prisma.request.findMany({
      where: {
        senderId: userId,
      },
    });
  },
  sendFriendRequest: async (userId, receiverId) => {
    return await prisma.request.create({
      data: {
        senderId: userId,
        receiverId: receiverId,
      },
    });
  },
  deleteFriendRequest: async (requestId) => {
    return await prisma.request.delete({
      where: {
        id: requestId,
      },
    });
  },
  acceptFriendRequest: async (requestId) => {
    return await prisma.$transaction(async (prisma) => {
      // Delete the request
      const deletedRequest = await prisma.request.delete({
        where: {
          id: requestId,
        },
      });

      // Add friends to both users' FriendList
      const newFriend = await prisma.friendList.upsert({
        where: { ownerId: deletedRequest.receiverId },
        update: {
          friends: {
            connect: { id: deletedRequest.senderId },
          },
        },
        create: {
          ownerId: deletedRequest.receiverId,
          friends: {
            connect: { id: deletedRequest.senderId },
          },
        },
      });

      await prisma.friendList.upsert({
        where: { ownerId: deletedRequest.senderId },
        update: {
          friends: {
            connect: { id: deletedRequest.receiverId },
          },
        },
        create: {
          ownerId: deletedRequest.senderId,
          friends: {
            connect: { id: deletedRequest.receiverId },
          },
        },
      });

      return { deletedRequest, newFriend };
    });
  },

  rejectFriendRequest: async (userId, requestId) => {
    return await prisma.$transaction(async (prisma) => {
      const deletedRequest = await prisma.request.delete({
        where: {
          id: requestId,
        },
      });

      const blockedUser = await prisma.friendList.upsert({
        where: { ownerId: userId },
        update: {
          blocked: {
            connect: { id: deletedRequest.senderId },
          },
        },
        create: {
          ownerId: userId,
          blocked: {
            connect: { id: deletedRequest.senderId },
          },
        },
      });

      return {
        deletedRequest: deletedRequest,
        blockedUser: blockedUser,
      };
    });
  },
};

export default requestQueries;
