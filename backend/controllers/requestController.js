import requestQueries from "../queries/requestQueries.js";
import asyncHandler from "express-async-handler";

const requestController = {
  sendFriendRequest: asyncHandler(async (req, res) => {
    res.json(
      await requestQueries.sendFriendRequest(req.userId, req.body.receiverId)
    );
  }),

  getAllRequests: asyncHandler(async (req, res) => {
    res.json(await requestQueries.getAllRequests(req.userId));
  }),

  getSingleRequest: asyncHandler(async (req, res) => {
    res.json(await requestQueries.getSingleRequest(req.params.requestId));
  }),

  getSentRequests: asyncHandler(async (req, res) => {
    res.json(await requestQueries.getSentRequests(req.userId));
  }),

  acceptFriendRequest: asyncHandler(async (req, res) => {
    res.json(await requestQueries.acceptFriendRequest(req.params.requestId));
  }),

  rejectFriendRequest: asyncHandler(async (req, res) => {
    res.json(
      await requestQueries.rejectFriendRequest(req.userId, req.params.requestId)
    );
  }),
};

export default requestController;
