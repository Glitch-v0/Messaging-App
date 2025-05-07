import { Router } from "express";
import friendController from "../controllers/friendController.js";
import { verifyToken } from "../utils/tokenUtils.js";

const router = Router();

router.get("/", verifyToken, async (req, res) => {
  await friendController.getFriends(req, res);
});

router.get("/:friendId", verifyToken, async (req, res) => {
  await friendController.getFriend(req, res);
});

router.delete("/:friendId/remove", verifyToken, async (req, res) => {
  await friendController.removeFriend(req, res);
});

router.delete("/:friendId/block", verifyToken, async (req, res) => {
  await friendController.removeAndBlockFriend(req, res);
});

router.delete("/:friendId/unblock", verifyToken, async (req, res) => {
  await friendController.removeBlockedUser(req, res);
});

export default router;
