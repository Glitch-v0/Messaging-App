import requestQueries from "../queries/requestQueries.js";

const requestController = {
  sendFriendRequest: async (req, res) => {
    res.json(await requestQueries.sendFriendRequest(req));
  },

  getAllRequests: async (req, res) => {
    res.json(await requestQueries.getAllRequests(req));
  },

  getSingleRequest: async (req, res) => {
    res.json(await requestQueries.getSingleRequest(req));
  },

  getSentRequests: async (req, res) => {
    res.json(await requestQueries.getSentRequests(req));
  },

  acceptFriendRequest: async (req, res) => {
    res.json(await requestQueries.acceptFriendRequest(req));
  },

  rejectFriendRequest: async (req, res) => {
    res.json(await requestQueries.rejectFriendRequest(req));
  },
};

export default requestController;
