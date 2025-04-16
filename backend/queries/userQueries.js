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

  getUserByOnline: async (userId) => {
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
        select: {
          id: true,
          name: true,
          lastSeen: true,
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve user." };
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
          allowRequests: body.allowRequests,
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

  getConversations: async (userId) => {
    try {
      return await prisma.conversation.findMany({
        where: {
          participants: {
            some: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          participants: {
            where: {
              // remove your id from each conversation's participants
              id: { not: userId },
            },
            select: {
              name: true,
            },
          },
          messages: {
            orderBy: {
              timestamp: "desc",
            },
            take: 1,
            select: {
              content: true,
              timestamp: true,
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve conversations." };
    }
  },

  getConversation: async (conversationId) => {
    try {
      return await prisma.conversation.findUnique({
        where: {
          id: conversationId,
        },
        select: {
          id: true,
          messages: {
            select: {
              id: true,
              content: true,
              sender: {
                select: {
                  name: true,
                  id: true,
                },
              },
              timestamp: true,
              reactions: true,
            },
            orderBy: {
              timestamp: "asc",
            },
          },
          participants: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve conversation." };
    }
  },

  createConversation: async (participants, senderId, message) => {
    try {
      return await prisma.conversation.create({
        data: {
          participants: {
            connect: participants.map((participant) => ({ id: participant })),
          },
          messages: {
            create: { content: message, sender: { connect: { id: senderId } } },
          },
        },
        select: {
          id: true,
          messages: {
            select: {
              id: true,
              content: true,
            },
          },
          participants: {
            select: {
              name: true,
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to create conversation." };
    }
  },

  deleteConversation: async (conversationId, userId) => {
    try {
      let conversation = await prisma.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          participants: {
            disconnect: {
              id: userId,
            },
          },
        },
        select: {
          id: true,
          participants: {
            select: {
              id: true,
            },
          },
        },
      });

      if (conversation.participants.length === 0) {
        return await prisma.conversation.delete({
          where: {
            id: conversation.id,
          },
        });
      }

      return conversation;
    } catch (error) {
      return { error: "Failed to delete conversation." };
    }
  },

  sendMessage: async (conversationId, senderId, message) => {
    try {
      return await prisma.message.create({
        data: {
          content: message,
          sender: { connect: { id: senderId } },
          conversation: { connect: { id: conversationId } },
        },
        select: {
          id: true,
          content: true,
          sender: {
            select: {
              name: true,
            },
          },
          timestamp: true,
          reactions: true,
        },
      });
    } catch (error) {
      return { error: "Failed to send message." };
    }
  },

  updateMessage: async (messageId, senderId, message) => {
    try {
      return await prisma.message.update({
        where: {
          id: messageId,
          senderId: senderId,
        },
        data: {
          content: message,
        },
      });
    } catch (error) {
      return { error: "Message does not exist" };
    }
  },

  deleteMessage: async (messageId, senderId) => {
    try {
      return await prisma.message.delete({
        where: {
          id: messageId,
          senderId: senderId,
        },
      });
    } catch (error) {
      return { error: "Message does not exist" };
    }
  },

  reactToMessage: async (userId, messageId, reactionType) => {
    console.log({ userId, messageId, reactionType });
    try {
      return await prisma.reaction.upsert({
        where: {
          messageId_userId: {
            messageId: messageId,
            userId: userId,
          },
        },
        create: {
          type: reactionType,
          user: {
            connect: {
              id: userId,
            },
          },
          message: {
            connect: {
              id: messageId,
            },
          },
        },
        update: {
          type: reactionType,
        },
        select: {
          id: true,
          type: true,
          messageId: true,
          userId: true,
        },
      });
    } catch (error) {
      return { error: "Failed to react to message." };
    }
  },

  removeReaction: async (userId, messageId) => {
    try {
      return await prisma.reaction.delete({
        where: {
          messageId_userId: {
            messageId: messageId,
            userId: userId,
          },
        },
      });
    } catch (error) {
      return { error: "Failed to remove reaction." };
    }
  },
};

export default userQueries;
