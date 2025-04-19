import asyncHandler from "express-async-handler";
import friendQueries from "../queries/friendQueries.js";

const friendController = {
  getFriends: asyncHandler(async (req, res) => {
    res.json(await friendQueries.getFriends(req.userId));
  }),

  getFriend: asyncHandler(async (req, res) => {
    res.json(await friendQueries.getFriend(req.userId, req.params.friendId));
  }),

  removeFriend: asyncHandler(async (req, res) => {
    res.json(await friendQueries.unfriend(req.userId, req.params.friendId));
  }),

  removeAndBlockFriend: asyncHandler(async (req, res) => {
    res.json(await friendQueries.block(req.userId, req.params.friendId));
  }),
};

export default friendController;
