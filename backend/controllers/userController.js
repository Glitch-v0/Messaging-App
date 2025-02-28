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

  getConversations: async (req, res) => {
    const conversations = await userQueries.getConversations(req.userId);
    res.json({ conversations });
  },
};

export default userController;
