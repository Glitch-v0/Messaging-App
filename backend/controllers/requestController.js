import requestQueries from "../queries/requestQueries.js";

const requestController = {
  sendFriendRequest: async (req, res) => {
    res.json(
      await requestQueries.sendFriendRequest(req.userId, req.body.receiverId)
    );
  },

  getAllRequests: async (req, res) => {
    res.json(await requestQueries.getAllRequests(req.userId));
  },

  getSingleRequest: async (req, res) => {
    res.json(await requestQueries.getSingleRequest(req.params.requestId));
  },

  getSentRequests: async (req, res) => {
    res.json(await requestQueries.getSentRequests(req.userId));
  },

  acceptFriendRequest: async (req, res) => {
    res.json(await requestQueries.acceptFriendRequest(req.params.requestId));
  },

  rejectFriendRequest: async (req, res) => {
    res.json(
      await requestQueries.rejectFriendRequest(req.userId, req.params.requestId)
    );
  },
};

export default requestController;
