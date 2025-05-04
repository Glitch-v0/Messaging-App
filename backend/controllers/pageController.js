import pageQueries from "../queries/pageQueries.js";

const pageController = {
  getConversationPageData: async (req, res) => {
    try {
      res.json(await pageQueries.getConversationPageData(req.userId));
    } catch (error) {
      res.json(error);
    }
  },
  getFriendPageData: async (req, res) => {
    try {
      res.json(await pageQueries.getFriendPageData(req.userId));
    } catch (error) {
      res.json(error);
    }
  },
};

export default pageController;
