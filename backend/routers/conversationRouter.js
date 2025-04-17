import { Router } from "express";
import userController from "../controllers/userController.js";
import { verifyToken } from "../utils/tokenUtils.js";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.get("/", verifyToken, async (req, res) => {
  await userController.getConversations(req, res);
});

router.get("/:conversationId", verifyToken, async (req, res) => {
  await userController.getConversation(req, res);
});

router.post("/", verifyToken, async (req, res) => {
  await userController.createConversation(req, res);
});

router.delete("/:conversationId", verifyToken, async (req, res) => {
  await userController.deleteConversation(req, res);
});

router.post("/:conversationId/messages", verifyToken, async (req, res) => {
  await userController.sendMessage(req, res);
});

router.put(
  "/:conversationId/messages/:messageId",
  verifyToken,
  async (req, res) => {
    await userController.updateMessage(req, res);
  },
);

router.delete(
  "/:conversationId/messages/:messageId",
  verifyToken,
  async (req, res) => {
    await userController.deleteMessage(req, res);
  },
);

router.patch(
  "/:conversationId/messages/:messageId/reaction",
  verifyToken,
  async (req, res) => {
    await userController.reactToMessage(req, res);
  },
);

router.delete(
  "/:conversationId/messages/:messageId/reaction",
  verifyToken,
  async (req, res) => {
    await userController.removeReaction(req, res);
  },
);

export default router;
