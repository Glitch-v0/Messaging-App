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
  await requestController.getRequests(req, res);
});

export default router;
