import { createToken } from "../utils/tokenUtils.js";
import { createHash, comparePasswords } from "../hashFunctions.js";
import userQueries from "../queries/userQueries.js";
import asyncHandler from "express-async-handler";

const userController = {
  handleRegister: async (req, res) => {
    const password = await createHash(req.body.password);
    const user = await userQueries.createUser(
      req.body.name,
      req.body.email,
      password
    );
    res.json({ name: user.name, id: user.id });
  },

  getUser: async (req, res) => {
    const user = await userQueries.getUserById(req.userId);
    res.json({ name: user.name, id: user.id });
  },

  getOnline: async (req, res) => {
    try {
      const users = await userQueries.getUsersByOnline(req.userId);
      const usersWithBooleans = users.map((user) => ({
        ...user,
        friends: user.friends !== null,
        receivedRequests: user.receivedRequests?.length > 0,
        sentRequests: user.sentRequests?.length > 0,
        isUser: user.id === req.userId,
      }));

      res.json(usersWithBooleans);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to get online users" });
    }
  },

  deleteUser: async (req, res) => {
    const user = await userQueries.getUserById(req.userId);
    const isMatch = await comparePasswords(
      req.body.password,
      user.hashedPassword
    );
    if (!isMatch) {
      return res.sendStatus(401);
    }
    res.json(await userQueries.deleteUser(req.userId));
  },

  handleLogin: async (req, res) => {
    const user = await userQueries.getUserHashByEmail(req.body.email);

    if (!user) {
      return res
        .status(401)
        .json({ error: "Credentials do not match any user" });
    }

    const isMatch = await comparePasswords(
      req.body.password,
      user.hashedPassword
    );
    if (!isMatch) {
      return res
        .status(401)
        .json({ error: "Credentials do not match any user" });
    }
    const newJWT = createToken(user);

    res
      .cookie("token", newJWT, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000 * 7,
        signed: true,
      })
      .json({ name: user.name, id: user.id });
  },

  handleLogout: async (req, res) => {
    res
      .clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        signed: true,
      })
      .json({ message: "You are now logged out." });
  },

  getProfile: async (req, res) => {
    res.json(await userQueries.getProfile(req.userId));
  },

  updateProfile: async (req, res) => {
    res.json(await userQueries.updateProfile(req.userId, req.body));
  },

  getFriends: async (req, res) => {
    res.json(await userQueries.getFriends(req.userId));
  },

  getBlocked: async (req, res) => {
    res.json(await userQueries.getBlocked(req.userId));
  },
};

export default userController;
