import prisma from "../prisma/prisma.js";

const userQueries = {
  createUser: async (req, hashedPassword) => {
    return await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        hashedPassword: hashedPassword,
      },
    });
  },

  getUser: async (req) => {
    return await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
  },

  getConversations: async (user) => {
    return await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: user.id,
          },
        },
      },
    });
  },
};

export default userQueries;
