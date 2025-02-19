import { Router } from "express";
import asyncHandler from "express-async-handler";
import express from "express";
const router = Router();

router.get("/ping", (req, res) => {
  res.json("pong");
});

router.get("/", (req, res) => {
  const paths = router.stack.map((layer) => layer.route.path);
  console.log(paths);
  res.json(paths);
});

export default router;
