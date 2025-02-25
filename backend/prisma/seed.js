import prisma from "./prisma.js";
import { createHash } from "../hashFunctions.js";

export const deleteScript = async () => {
  const users = await prisma.user.findMany();
  await prisma.user.deleteMany({
    where: { id: { in: users.map((u) => u.id) } },
  });
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
