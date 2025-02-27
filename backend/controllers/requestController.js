import requestQueries from "../queries/requestQueries.js";

const requestController = {
  sendFriendRequest: async (req, res) => {
    res.json(await requestQueries.sendFriendRequest(req));
  },

  getRequests: async (req, res) => {
    res.json(await requestQueries.getRequests(req));
  },
};

export default requestController;
