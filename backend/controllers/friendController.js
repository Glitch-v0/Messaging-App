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
    const query = await friendQueries.unfriend(req.userId, req.params.friendId);
    if (query.error) {
      res.status(404).json(query);
    } else {
      res.status(200).json(query);
    }
  }),

  removeAndBlockFriend: asyncHandler(async (req, res) => {
    const query = await friendQueries.block(req.userId, req.params.friendId);
    if (query.error) {
      res.status(404).json(query);
    } else {
      res.status(200).json({
        message: `${req.params.friendId} was successfully blocked.`,
        blockedId: req.params.friendId,
      });
    }
  }),

  removeBlockedUser: asyncHandler(async (req, res) => {
    const query = await friendQueries.unblock(req.userId, req.params.friendId);
    if (query.error) {
      res.status(404).json(query);
    } else {
      res.status(200).json({
        message: `${req.params.friendId} was successfully unblocked.`,
        id: req.params.friendId,
      });
    }
  }),
};

export default friendController;
