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

  getConversations: async (userId) => {
    return await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
    });
  },
};

export default userQueries;
