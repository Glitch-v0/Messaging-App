import { createToken } from "../utils/tokenUtils.js";
import { createHash, comparePasswords } from "../hashFunctions.js";
import userQueries from "../queries/userQueries.js";

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
    const user = await userQueries.getUser(req.userId);
    res.json({ name: user.name, id: user.id });
  },

  handleLogin: async (req, res) => {
    const user = await userQueries.getUser(req);
    //Check password
    const passwordHash = await createHash(req.body.password);

    const isMatch = await comparePasswords(req.body.password, passwordHash);
    if (!isMatch) {
      return res.sendStatus(401);
    }
    const newJWT = createToken(user);

    res.json({ token: newJWT });
  },

  getFriends: async (req, res) => {
    res.json(await userQueries.getFriends(req.userId));
  },

  getBlocked: async (req, res) => {
    res.json(await userQueries.getBlockedUsers(req.userId));
  },

  getConversations: async (req, res) => {
    res.json(await userQueries.getConversations(req.userId));
  },

  createConversation: async (req, res) => {
    // Check if participants are on either's blocklist
    const blocked = await userQueries.checkIfParticipantsAreBlocked(
      req.body.participants
    );

    if (blocked) {
      res.status(403).json({
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
};

export default userController;
