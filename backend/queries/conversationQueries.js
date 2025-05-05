import prisma from "../prisma/prisma.js";

const conversationQueries = {
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
              id: true,
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
              id: true,
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve conversation." };
    }
  },

  getConversationsByParticipants: async (participantIds) => {
    try {
      return await prisma.conversation.findMany({
        where: {
          // All required participants must be in the conversation
          participants: {
            every: {
              id: {
                in: participantIds,
              },
            },
          },
        },
        select: {
          id: true,
          _count: {
            select: {
              participants: true,
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve conversations." };
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

      if (conversation.participants.length < 2) {
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
          conversation: {
            select: {
              id: true,
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

export default conversationQueries;
