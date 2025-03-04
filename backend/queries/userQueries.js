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
};

export default userQueries;
