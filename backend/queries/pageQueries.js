import prisma from "../prisma/prisma.js";

const pageQueries = {
  getConversationPageData: async (userId) => {
    //get user's friends and conversations
    try {
      return await prisma.user.findUnique({
        where: { id: userId },
        select: {
          friends: {
            select: {
              friends: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          conversations: {
            select: {
              id: true,
              participants: {
                where: {
                  // remove your id from each conversation's participants
                  id: { not: userId },
                },
                select: {
                  name: true,
                },
              },
              messages: {
                orderBy: {
                  timestamp: "desc",
                },
                take: 1,
                select: {
                  content: true,
                  timestamp: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve user." };
    }
  },

  getFriendPageData: async (userId) => {
    //get friendlist and blocklist
    try {
      return await prisma.friendList.findUnique({
        where: { ownerId: userId },
        select: {
          friends: {
            select: {
              name: true,
              id: true,
            },
          },
          blocked: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
    } catch (error) {
      return { error: "Failed to retrieve info." };
    }
  },
};

export default pageQueries;
