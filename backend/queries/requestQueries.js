import prisma from "../prisma/prisma.js";

const requestQueries = {
  getAllRequests: async (req) => {
    return await prisma.request.findMany({
      where: {
        receiverId: req.userId,
      },
    });
  },
  getSingleRequest: async (req) => {
    return await prisma.request.findUnique({
      where: {
        id: req.params.requestId,
      },
    });
  },
  getSentRequests: async (req) => {
    return await prisma.request.findMany({
      where: {
        senderId: req.userId,
      },
    });
  },
  sendFriendRequest: async (req) => {
    return await prisma.request.create({
      data: {
        senderId: req.userId,
        receiverId: req.body.receiverId,
      },
    });
  },
  deleteFriendRequest: async (req) => {
    return await prisma.request.delete({
      where: {
        id: req.params.id,
      },
    });
  },
  acceptFriendRequest: async (req) => {
    return await prisma.$transaction(async (prisma) => {
      // Delete the request
      const deletedRequest = await prisma.request.delete({
        where: {
          id: req.params.requestId,
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

  rejectFriendRequest: async (req) => {
    return await prisma.$transaction(async (prisma) => {
      const deletedRequest = await prisma.request.delete({
        where: {
          id: req.params.requestId,
        },
      });

      const blockedUser = await prisma.friendList.update({
        where: { ownerId: req.userId },
        data: {
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
