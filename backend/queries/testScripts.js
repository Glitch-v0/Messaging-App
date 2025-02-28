import prisma from "../prisma/prisma.js";

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

  console.log("Database reset complete.");
};

export const createScript = async () => {
  //Create three users

  const hash1 = await createHash("test1");
  const hash2 = await createHash("test2");
  const hash3 = await createHash("test3");

  let [user1, user2, user3] = await prisma.user.createMany({
    data: [
      {
        name: "test1",
        email: "test1@gmail.com",
        hashedPassword: hash1,
      },
      {
        name: "test2",
        email: "tes2@gmail.com",
        hashedPassword: hash2,
      },
      {
        name: "test3",
        email: "test3@gmail.com",
        hashedPassword: hash3,
      },
    ],
  });
};
