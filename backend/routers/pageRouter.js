import { Router } from "express";
import pageController from "../controllers/pageController.js";
import { verifyToken } from "../utils/tokenUtils.js";

const router = Router();

router.get("/conversations", verifyToken, async (req, res) => {
  await pageController.getConversationPageData(req, res);
});

export default router;
