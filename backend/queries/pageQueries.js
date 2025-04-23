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
};

export default pageQueries;
