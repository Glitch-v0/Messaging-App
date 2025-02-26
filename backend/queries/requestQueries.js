import prisma from "../prisma/prisma.js";

const requestQueries = {
  getRequests: async (req) => {
    return await prisma.request.findMany({
      where: {
        receiverId: req.user.id,
      },
    });
  },
  sendFriendRequest: async (req) => {
    console.log(req.user);
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
        ownerId: req.user.id,
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
