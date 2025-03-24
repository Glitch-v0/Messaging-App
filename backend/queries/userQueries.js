import prisma from "../prisma/prisma.js";

const userQueries = {
  createUser: async (name, email, hashedPassword) => {
    return await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  },

  getUserById: async (userId) => {
    return await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  },

  getUserHashByEmail: async (email) => {
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
  },

  deleteUser: async (userId) => {
    return await prisma.user.delete({
      where: {
        id: userId,
      },
    });
  },

  getProfile: async (userId) => {
    return await prisma.profile.findUnique({
      where: {
        userId: userId,
      },
    });
  },

  updateProfile: async (userId, body) => {
    return await prisma.profile.update({
      where: {
        userId,
      },
      data: {
        // Making boolean values out of string inputs from json object
        darkMode: body.darkMode === "true",
        showOnline: body.showOnline === "true",
        allowRequests: body.allowRequests === "true",
      },
    });
  },

  addFriend: async (userId, friendId) => {
    //Connect friends from both directions
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
  },

  addBlocked: async (userId, blockedId) => {
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
  },

  getFriends: async (userId) => {
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
  },

  getBlocked: async (userId) => {
    return await prisma.friendList.findUnique({
      where: {
        ownerId: userId,
      },
      select: {
        blocked: true,
      },
    });
  },

  checkIfParticipantsAreBlocked: async (participantsIds) => {
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
  },

  checkIfParticipantsAreFriends: async (participantsIds) => {
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
  },

  getConversations: async (userId) => {
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
          select: {
            name: true,
          },
        },
      },
    });
  },

  getConversation: async (conversationId) => {
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
              },
            },
            timestamp: true,
          },
        },
        participants: {
          select: {
            name: true,
          },
        },
      },
    });
  },

  createConversation: async (participants, senderId, message) => {
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
  },

  deleteConversation: async (conversationId, userId) => {
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
  },

  sendMessage: async (conversationId, senderId, message) => {
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
      },
    });
  },

  updateMessage: async (messageId, senderId, message) => {
    return await prisma.message.update({
      where: {
        id: messageId,
        senderId: senderId,
      },
      data: {
        content: message,
      },
    });
  },

  deleteMessage: async (messageId, senderId) => {
    const hm = await prisma.message.delete({
      where: {
        id: messageId,
        senderId: senderId,
      },
    });

    return hm;
  },

  reactToMessage: async (userId, messageId, reactionType) => {
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
        type: true,
        messageId: true,
        userId: true,
      },
    });
  },

  removeReaction: async (userId, messageId) => {
    const res = await prisma.reaction.delete({
      where: {
        messageId_userId: {
          messageId: messageId,
          userId: userId,
        },
      },
    });
    return res;
  },
};

export default userQueries;
