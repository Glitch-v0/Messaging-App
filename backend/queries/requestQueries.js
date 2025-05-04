import prisma from "../prisma/prisma.js";

const requestQueries = {
  getAllRequests: async (userId) => {
    try {
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
            OR: [
              {
                receiverId: userId,
                senderId: {
                  notIn: blockedUserIds,
                },
              },
              {
                senderId: userId,
              },
            ],
          },
          select: {
            id: true,
            senderId: true,
            sender: {
              select: {
                name: true,
              },
            },
            dateSent: true,
          },
        });
      });
    } catch (error) {
      return { error: "Failed to retrieve requests." };
    }
  },
  getSingleRequest: async (requestId) => {
    try {
      return await prisma.request.findUnique({
        where: {
          id: requestId,
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve request." };
    }
  },
  getSentRequests: async (userId) => {
    try {
      return await prisma.request.findMany({
        where: {
          senderId: userId,
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve sent requests." };
    }
  },
  sendFriendRequest: async (userId, receiverId) => {
    try {
      return await prisma.request.create({
        data: {
          senderId: userId,
          receiverId: receiverId,
        },
      });
    } catch (error) {
      return { error: "Failed to send friend request." };
    }
  },
  deleteFriendRequest: async (requestId) => {
    try {
      return await prisma.request.delete({
        where: {
          id: requestId,
        },
      });
    } catch (error) {
      return { error: "Failed to delete friend request." };
    }
  },
  acceptFriendRequest: async (requestId) => {
    try {
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
    } catch (error) {
      return { error: "Failed to accept friend request." };
    }
  },

  rejectFriendRequest: async (userId, requestId) => {
    try {
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
    } catch (error) {
      return { error: "Failed to reject friend request." };
    }
  },
};

export default requestQueries;
