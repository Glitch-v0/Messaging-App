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
  await userController.getBlocked(req, res);
});

router.get("/profile", verifyToken, async (req, res) => {
  await userController.getProfile(req, res);
});

router.put("/profile", verifyToken, async (req, res) => {
  await userController.updateProfile(req, res);
});

router.delete("/profile", verifyToken, async (req, res) => {
  await userController.deleteUser(req, res);
});

export default router;
