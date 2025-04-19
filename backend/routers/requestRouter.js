import { Router } from "express";
import requestController from "../controllers/requestController.js";
import { verifyToken } from "../utils/tokenUtils.js";

const router = Router();

router.post("/", verifyToken, async (req, res) => {
  await requestController.sendFriendRequest(req, res);
});

router.get("/", verifyToken, async (req, res) => {
  await requestController.getAllRequests(req, res);
});

router.get("/sent", verifyToken, async (req, res) => {
  await requestController.getSentRequests(req, res);
});

router.get("/:requestId", verifyToken, async (req, res) => {
  await requestController.getSingleRequest(req, res);
});

router.post("/:requestId/accept", verifyToken, async (req, res) => {
  await requestController.acceptFriendRequest(req, res);
});

router.post("/:requestId/reject", verifyToken, async (req, res) => {
  await requestController.rejectFriendRequest(req, res);
});

export default router;
