import { Router } from "express";
import userRouter from "./userRouter.js";
import requestRouter from "./requestRouter.js";
import conversationRouter from "./conversationRouter.js";

const router = Router();

router.get("/ping", (req, res) => {
  res.json("pong");
});
router.use("/api", userRouter);

router.use("/api/request", requestRouter);

router.use("/api/conversations", conversationRouter);

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
