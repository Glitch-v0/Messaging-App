import prisma from "../prisma.js";
const userController = {
  createUser: async (req, res) => {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        hashedPassword: req.body.hashedPassword,
      },
    });
    res.json(user);
  },

  getUser: async (req, res) => {},
};
