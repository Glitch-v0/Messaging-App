import prisma from "../prisma/prisma.js";
import { createToken } from "../utils/tokenUtils.js";
import { createHash } from "../hashFunctions.js";
import userQueries from "./userQueries.js";

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
    const me = await userQueries.createUser(
      "njonesDev",
      "njones@test.com",
      await createHash("test")
    );
    console.log({ bot, me });
    await userQueries.addFriend(me.id, bot.id);
    await userQueries.createConversation([me.id, bot.id], me.id, "hi");
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
    const token = createToken(user);

    if (numberOfUsers === 1) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        token: token,
      };
    }
    users.push({
      id: user.id,
      name: user.name,
      email: user.email,
      token: token,
    });
  }
  return users;
};
