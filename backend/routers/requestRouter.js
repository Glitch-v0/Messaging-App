import { Router } from "express";
import requestController from "../controllers/requestController.js";
import { verifyToken } from "../utils/tokenUtils.js";
import expressAsyncHandler from "express-async-handler";

const router = Router();

// router.post(
//   "/:userId",
//   expressAsyncHandler(async (req, res) => {
//     await requestController.sendFriendRequest(req, res);
//   })
// );

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

router.get("/:requestId/accept", verifyToken, async (req, res) => {
  await requestController.acceptFriendRequest(req, res);
});

router.get("/:requestId/reject", verifyToken, async (req, res) => {
  await requestController.rejectFriendRequest(req, res);
});

export default router;
