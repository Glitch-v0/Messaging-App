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
    res.json(await userQueries.getUserByOnline(req.userId));
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

  getConversation: async (req, res) => {
    const conversation = await userQueries.getConversation(
      req.params.conversationId
    );
    if (!conversation) {
      return res.sendStatus(404);
    }
    res.json(conversation);
  },

  getConversations: async (req, res) => {
    res.json(await userQueries.getConversations(req.userId));
  },

  createConversation: async (req, res) => {
    // Check if participants are on either's blocklist
    const friends = await userQueries.checkIfParticipantsAreFriends(
      req.body.participants
    );

    if (!friends) {
      return res.status(403).json({
        error: "All users must be friends to create a group conversation",
      });
    }
    res.json(
      await userQueries.createConversation(
        req.body.participants,
        req.userId,
        req.body.message
      )
    );
  },

  deleteConversation: async (req, res) => {
    res.json(
      await userQueries.deleteConversation(
        req.params.conversationId,
        req.userId
      )
    );
  },

  sendMessage: async (req, res) => {
    res.json(
      await userQueries.sendMessage(
        req.params.conversationId,
        req.userId,
        req.body.message
      )
    );
  },

  updateMessage: async (req, res) => {
    res.json(
      await userQueries.updateMessage(
        req.params.messageId,
        req.userId,
        req.body.message
      )
    );
  },

  deleteMessage: async (req, res) => {
    res.json(await userQueries.deleteMessage(req.params.messageId, req.userId));
  },

  reactToMessage: async (req, res) => {
    res.json(
      await userQueries.reactToMessage(
        req.userId,
        req.params.messageId,
        req.body.reactionType
      )
    );
  },

  removeReaction: async (req, res) => {
    res.json(
      await userQueries.removeReaction(req.userId, req.params.messageId)
    );
  },
};

export default userController;
