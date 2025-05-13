import { Router } from "express";
import conversationController from "../controllers/conversationController.js";
import { verifyToken } from "../utils/tokenUtils.js";

const router = Router();

router.get("/", verifyToken, async (req, res) => {
  await conversationController.getConversations(req, res);
});

router.get("/:conversationId", verifyToken, async (req, res) => {
  await conversationController.getConversation(req, res);
});

router.get("/:conversationId/messages", verifyToken, async (req, res) => {
  await conversationController.getOlderMessages(req, res);
});

router.post("/", verifyToken, async (req, res) => {
  await conversationController.createConversation(req, res);
});

router.delete("/:conversationId", verifyToken, async (req, res) => {
  await conversationController.deleteConversation(req, res);
});

router.post("/:conversationId/messages", verifyToken, async (req, res) => {
  await conversationController.sendMessage(req, res);
});

router.put(
  "/:conversationId/messages/:messageId",
  verifyToken,
  async (req, res) => {
    await conversationController.updateMessage(req, res);
  }
);

router.delete(
  "/:conversationId/messages/:messageId",
  verifyToken,
  async (req, res) => {
    await conversationController.deleteMessage(req, res);
  }
);

router.patch(
  "/:conversationId/messages/:messageId/reaction",
  verifyToken,
  async (req, res) => {
    await conversationController.reactToMessage(req, res);
  }
);

router.delete(
  "/:conversationId/messages/:messageId/reaction",
  verifyToken,
  async (req, res) => {
    await conversationController.removeReaction(req, res);
  }
);

export default router;
