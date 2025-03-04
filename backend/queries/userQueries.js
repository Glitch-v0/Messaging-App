import prisma from "../prisma/prisma.js";

const userQueries = {
  createUser: async (name, email, hashedPassword) => {
    return await prisma.user.create({
      data: {
        name: name,
        email: email,
        hashedPassword: hashedPassword,
      },
    });
  },

  getUser: async (userId) => {
    return await prisma.user.findUnique({
      where: {
        id: userId,
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

  deleteMessage: async (messageId) => {
    await prisma.message.delete({
      where: {
        id: messageId,
      },
    });
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
};

export default userQueries;
