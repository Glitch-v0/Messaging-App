import prisma from "../prisma/prisma.js";
import { createHash } from "../hashFunctions.js";
import userQueries from "./userQueries.js";
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
    const bot = await userQueries.createUser(
      "Your Robot Assistant",
      "robo@test.com",
      await createHash("test")
    );
    const bot2 = await userQueries.createUser(
      "Test Robo Bro",
      "robo2@test.com",
      await createHash("test")
    );
    const me = await userQueries.createUser(
      "njonesDev",
      "njones@test.com",
      await createHash("test")
    );
    console.log({ bot, bot2, me });
    await userQueries.addFriend(me.id, bot.id);
    await requestQueries.sendFriendRequest(bot2.id, me.id);
    const conv1 = await userQueries.createConversation(
      [me.id, bot.id],
      bot.id,
      "Hey there! So glad you decided to join." +
        "Feel free to talk to me, but I am unfortunately not programmed to respond back."
    );
    const conv2 = await userQueries.createConversation(
      [me.id, bot2.id],
      bot.id,
      "Hi there! I'm sending you these messages to show you features of your conversation. Your newest conversation is shown first." +
        " When you click on a conversation from the left, the messages for it will load on the right. You can also react to and edit messages."
    );
    const message = await userQueries.sendMessage(
      conv2.id,
      me.id,
      "Good to know. Thanks for the information."
    );

    await userQueries.reactToMessage(bot.id, message.id, "👍");
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
