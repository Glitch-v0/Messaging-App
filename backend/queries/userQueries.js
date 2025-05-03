import prisma from "../prisma/prisma.js";

const userQueries = {
  createUser: async (name, email, hashedPassword) => {
    try {
      return await prisma.user.create({
        data: {
          name: name,
          email: email,
          hashedPassword: hashedPassword,
          profile: {
            create: {},
          },
          friends: {
            create: {},
          },
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
    } catch (error) {
      return { error: "Failed to create user." };
    }
  },

  getUserById: async (userId) => {
    try {
      return await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve user." };
    }
  },

  getUserHashByEmail: async (email) => {
    try {
      return await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
          email: true,
          hashedPassword: true,
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve user." };
    }
  },

  getUsersByOnline: async (userId) => {
    try {
      return await prisma.user.findMany({
        where: {
          profile: {
            showOnline: true,
          },
          // Exclude users who have blocked you
          NOT: {
            friends: {
              blocked: {
                some: {
                  id: userId,
                },
              },
            },
          },
          // Exclude users you have blocked
          blockedBy: {
            none: {
              ownerId: userId,
            },
          },
        },
        include: {
          friends: {
            where: {
              friends: {
                some: {
                  id: userId,
                },
              },
            },
            select: {
              id: true,
            },
          },

          receivedRequests: {
            where: {
              senderId: userId,
            },
          },

          sentRequests: {
            where: {
              receiverId: userId,
            },
          },
        },
        omit: {
          email: true,
          hashedPassword: true,
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve users." };
    }
  },

  deleteUser: async (userId) => {
    try {
      return await prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error) {
      return { error: "Failed to delete user." };
    }
  },

  getProfile: async (userId) => {
    try {
      return await prisma.profile.findUnique({
        where: {
          userId: userId,
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve profile." };
    }
  },

  updateProfile: async (userId, body) => {
    try {
      return await prisma.profile.update({
        where: {
          userId,
        },
        data: {
          // Making boolean values out of string inputs from json object
          darkMode: body.darkMode,
          showOnline: body.showOnline,
        },
      });
    } catch (error) {
      return { error: "Failed to update profile." };
    }
  },

  addFriend: async (userId, friendId) => {
    //Connect friends from both directions
    try {
      return await prisma.$transaction([
        prisma.friendList.upsert({
          where: { ownerId: userId },
          update: {
            friends: { connect: { id: friendId } },
          },
          create: {
            ownerId: userId,
            friends: { connect: { id: friendId } },
          },
        }),
        prisma.friendList.upsert({
          where: { ownerId: friendId },
          update: {
            friends: { connect: { id: userId } },
          },
          create: {
            ownerId: friendId,
            friends: { connect: { id: userId } },
          },
        }),
      ]);
    } catch (error) {
      return { error: "Failed to add friend." };
    }
  },

  addBlocked: async (userId, blockedId) => {
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

  getBlocked: async (userId) => {
    try {
      return await prisma.friendList.findUnique({
        where: {
          ownerId: userId,
        },
        select: {
          blocked: true,
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve block list." };
    }
  },

  checkIfParticipantsAreBlocked: async (participantsIds) => {
    try {
      const blocked = await prisma.friendList.findMany({
        where: {
          ownerId: {
            in: participantsIds,
          },
          blocked: {
            some: {
              id: {
                in: participantsIds,
              },
            },
          },
        },
      });

      // True if any participant is blocked on the other's list
      return blocked.length > 0;
    } catch (error) {
      return { error: "Failed to check if participants are blocked." };
    }
  },

  checkIfParticipantsAreFriends: async (participantsIds) => {
    try {
      const friends = await prisma.friendList.findMany({
        where: {
          ownerId: {
            in: participantsIds,
          },
          friends: {
            some: {
              id: {
                in: participantsIds,
              },
            },
          },
        },
      });

      // True if any participant is friends on the other's list
      return friends.length === participantsIds.length;
    } catch (error) {
      return { error: "Failed to check if participants are friends." };
    }
  },
};

export default userQueries;
