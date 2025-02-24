import prisma from "../prisma/prisma.js";
import { decodeToken } from "../utils/tokenUtils.js";

const userQueries = {
  createUser: async (req, hashedPassword) => {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        hashedPassword: hashedPassword,
      },
    });
    return user;
  },

  getUser: async (req) => {
    const user = await prisma.user.findUnique({
      where: {
        email: req.body.email,
      },
    });
    return user;
  },

  getConversations: async (req, res) => {
    const decodedToken = decodeToken(req.headers.authorization);
  },
};

export default userQueries;
