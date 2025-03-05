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

router.post("/:conversationId", verifyToken, async (req, res) => {
  await userController.sendMessage(req, res);
});

router.delete("/:conversationId", verifyToken, async (req, res) => {
  await userController.deleteConversation(req, res);
});

export default router;
