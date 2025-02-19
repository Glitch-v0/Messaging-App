import prisma from "../prisma.js";
import bcrypt from "bcryptjs";

const userController = {
  createUser: async (req, res) => {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        hashedPassword: bcrypt,
      },
    });
    res.json(user);
  },

  getUser: async (req, res) => {},
};
