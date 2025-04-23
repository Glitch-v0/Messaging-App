import pageQueries from "../queries/pageQueries.js";

const pageController = {
  getConversationPageData: async (req, res) => {
    console.log("Calling the query...", req.userId);
    try {
      res.json(await pageQueries.getConversationPageData(req.userId));
    } catch (error) {
      res.json(error);
    }
  },
};

export default pageController;
