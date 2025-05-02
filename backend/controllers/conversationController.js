import conversationQueries from "../queries/conversationQueries.js";
import userQueries from "../queries/userQueries.js";

const conversationController = {
  getConversation: async (req, res) => {
    const conversation = await conversationQueries.getConversation(
      req.params.conversationId
    );

    //add owner property to each message based on req.userId
    if (conversation) {
      conversation.messages.forEach((message) => {
        if (message.sender.id === req.userId) {
          message.owner = true;
        } else {
          message.owner = false;
        }
      });
      res.json(conversation);
    } else {
      res.sendStatus(404);
    }
  },

  getConversations: async (req, res) => {
    res.json(await conversationQueries.getConversations(req.userId));
  },

  createConversation: async (req, res) => {
    console.log(req.body.participants, req.body.message, req.userId);

    if (
      req.body.participants.length === 0 ||
      !req.body.participants ||
      !req.body.message
    ) {
      console.log("Missing something!");
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
    // Check if participants are on either's blocklist
    const friends = await userQueries.checkIfParticipantsAreFriends(
      req.body.participants
    );

    if (!friends) {
      return res.status(403).json({
        error: "All users must be friends to create a group conversation",
      });
    }

    if (friends.error) {
      return res.status(500).json({ error: friends.error });
    }
    res.json(
      await conversationQueries.createConversation(
        [...req.body.participants, req.userId],
        req.userId,
        req.body.message
      )
    );
  },

  deleteConversation: async (req, res) => {
    res.json(
      await conversationQueries.deleteConversation(
        req.params.conversationId,
        req.userId
      )
    );
  },

  sendMessage: async (req, res) => {
    res.json(
      await conversationQueries.sendMessage(
        req.params.conversationId,
        req.userId,
        req.body.message
      )
    );
  },

  updateMessage: async (req, res) => {
    res.json(
      await conversationQueries.updateMessage(
        req.params.messageId,
        req.userId,
        req.body.message
      )
    );
  },

  deleteMessage: async (req, res) => {
    if (req.params.messageId === "undefined") {
      return res.sendStatus(400);
    }
    const response = await conversationQueries.deleteMessage(
      req.params.messageId,
      req.userId
    );
    if (response.error) {
      res.status(404).json(response);
    } else {
      res.status(200).json(response);
    }
  },

  reactToMessage: async (req, res) => {
    const response = await conversationQueries.reactToMessage(
      req.userId,
      req.params.messageId,
      req.body.reactionType
    );
    console.log({ response });
    res.json(response);
  },

  removeReaction: async (req, res) => {
    res.json(
      await conversationQueries.removeReaction(req.userId, req.params.messageId)
    );
  },
};

export default conversationController;
