import crypto from "crypto";
import prisma from "../prisma/prisma.js";
import { createHash } from "../hashFunctions.js";
import userQueries from "./userQueries.js";
import conversationQueries from "./conversationQueries.js";
import requestQueries from "./requestQueries.js";

export const deleteScript = async () => {
  // Delete reactions first
  await prisma.reaction.deleteMany();

  // Delete messages
  await prisma.message.deleteMany();

  // Delete conversations
  await prisma.conversation.deleteMany();

  // Delete requests
  await prisma.request.deleteMany();

  // Delete profiles
  await prisma.profile.deleteMany();

  // Delete friend lists
  await prisma.friendList.deleteMany();

  // Finally, delete users
  await prisma.user.deleteMany();
};

export const createScript = async () => {
  await prisma.$transaction(async () => {
    const bot1 = await userQueries.createUser(
      "HelperBot",
      "robo1@test.com",
      await createHash(crypto.randomUUID())
    );
    const bot2 = await userQueries.createUser(
      "RoboBro",
      "robo2@test.com",
      await createHash(crypto.randomUUID())
    );
    const bot3 = await userQueries.createUser(
      "PotentialFriendBot",
      "robo3@test.com",
      await createHash(crypto.randomUUID())
    );
    const me = await userQueries.createUser(
      "njonesDev",
      "njones@test.com",
      await createHash("test")
    );
    //Add some bots friends and one bot request
    await userQueries.addFriend(me.id, bot1.id);
    await userQueries.addFriend(me.id, bot2.id);
    await requestQueries.sendFriendRequest(bot3.id, me.id);

    //Bots are all friends
    await userQueries.addFriend(bot1.id, bot2.id);
    await userQueries.addFriend(bot1.id, bot3.id);
    await userQueries.addFriend(bot2.id, bot3.id);

    const conv1 = await conversationQueries.createConversation(
      [me.id, bot1.id],
      bot1.id,
      "Hey there! So glad you decided to join." +
        "Feel free to talk to me, but I am unfortunately not programmed to respond back."
    );
    const conv2 = await conversationQueries.createConversation(
      [me.id, bot2.id],
      bot1.id,
      "Hi there! I'm sending you these messages to show you features of your conversation. Your newest conversation is shown first." +
        " When you click on a conversation from the left, the messages for it will load on the right. You can also react to and edit messages."
    );
    const message = await conversationQueries.sendMessage(
      conv2.id,
      me.id,
      "Good to know. Thanks for the information."
    );

    await conversationQueries.reactToMessage(bot1.id, message.id, "👍");
  });
};

export const userTokenScript = async (numberOfUsers) => {
  let users = [];
  for (let i = 0; i < numberOfUsers; i++) {
    const hashedPassword = await createHash(`test${i}`);
    const user = await prisma.user.create({
      data: {
        name: `test${i}`,
        email: `test${i}@gmail.com`,
        hashedPassword: hashedPassword,
        profile: {
          create: {},
        },
      },
    });
    // const token = createToken(user);

    if (numberOfUsers === 1) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        // token: token,
      };
    }
    users.push({
      id: user.id,
      name: user.name,
      email: user.email,
      // token: token,
    });
  }
  return users;
};
