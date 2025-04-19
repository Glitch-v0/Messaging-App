import { Router } from "express";
import userRouter from "./userRouter.js";
import requestRouter from "./requestRouter.js";
import friendRouter from "./friendRouter.js";
import conversationRouter from "./conversationRouter.js";
import { verifyToken } from "../utils/tokenUtils.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.json("pong");
});
router.use("/api", userRouter);

router.use("/api/requests", requestRouter);

router.use("/api/friends", friendRouter);

router.use("/api/conversations", conversationRouter);

// A way for the frontend to check if the http cookie is valid
router.use("/api/whoami", verifyToken, (req, res) => {
  res.json({ authenticated: true, user: req.user });
});

router.get("/", (req, res) => {
  const routes = [];

  // Add routes from the main router
  router.stack.forEach((r) => {
    if (r?.route?.path) {
      const methods = Object.keys(r.route.methods).map((method) =>
        method.toUpperCase()
      );
      methods.forEach((method) => {
        routes.push(`${method} ${r.route.path}`);
      });
    }
  });

  // Add routes from the userRouter
  userRouter.stack.forEach((r) => {
    if (r?.route?.path) {
      const methods = Object.keys(r.route.methods).map((method) =>
        method.toUpperCase()
      );
      methods.forEach((method) => {
        routes.push(`${method} ${r.route.path}`);
      });
    }
  });

  // console.log({ routes });
  res.json(routes);
});

export default router;
