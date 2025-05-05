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
    if (
      req.body.participants.length === 0 ||
      !req.body.participants ||
      !req.body.message
    ) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }

    // Check if participants are on either's blocklist
    if (req.body.participants.length > 1) {
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
    }

    // Find conversations with those participants, and filter by length

    const conversationsWithParticipants =
      await conversationQueries.getConversationsByParticipants([
        ...req.body.participants,
        req.userId,
      ]);

    const conversationExists = conversationsWithParticipants.find(
      (c) => c._count.participants === req.body.participants.length + 1
    );

    if (conversationExists) {
      res.json(
        await conversationQueries.sendMessage(
          conversationExists.id,
          req.userId,
          req.body.message
        )
      );
    } else {
      res.json(
        await conversationQueries.createConversation(
          [...req.body.participants, req.userId],
          req.userId,
          req.body.message
        )
      );
    }
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
    //Make sure sender is in the conversation
    const conversation = await conversationQueries.getConversation(
      req.params.conversationId
    );
    if (
      !conversation ||
      !conversation.participants.some(
        (participant) => participant.id === req.userId
      )
    ) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    //Send message
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
    res.json(response);
  },

  removeReaction: async (req, res) => {
    res.json(
      await conversationQueries.removeReaction(req.userId, req.params.messageId)
    );
  },
};

export default conversationController;
