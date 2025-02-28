import prisma from "./prisma.js";
import { createHash } from "../hashFunctions.js";

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

  await prisma.user.createMany({
    data: [
      {
        name: "test1",
        email: "test1@gmail.com",
        hashedPassword: hash1,
      },
      {
        name: "tes2",
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

async function main() {
  //   deleteScript();
  // createScript();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
