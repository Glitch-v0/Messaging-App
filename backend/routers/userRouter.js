import { Router } from "express";
import userController from "../controllers/userController.js";
import { verifyToken } from "../utils/tokenUtils.js";
import expressAsyncHandler from "express-async-handler";

const router = Router();

router.post(
  "/register",
  expressAsyncHandler(async (req, res) => {
    await userController.handleRegister(req, res);
  })
);

router.post("/login", async (req, res) => {
  await userController.handleLogin(req, res);
});

router.get("/friends", verifyToken, async (req, res) => {
  await userController.getFriends(req, res);
});

router.get("/blocked", verifyToken, async (req, res) => {
  await userController.getBlockedUsers(req, res);
});

router.get("/conversation", verifyToken, async (req, res) => {
  await userController.getConversations(req, res);
});

export default router;
