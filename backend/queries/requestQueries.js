import prisma from "../prisma/prisma.js";

const requestQueries = {
  getRequests: async (req) => {
    return await prisma.request.findMany({
      where: {
        receiverId: req.userId,
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
    // Add friend
    await prisma.friendList.update({
      where: {
        ownerId: req.userId,
      },
      data: {
        friends: {
          connect: {
            id: req.body.receiverId,
          },
        },
      },
    });
    // Delete request
    await prisma.request.delete({
      where: {
        id: req.params.id,
      },
    });
  },
};

export default requestQueries;
