import prisma from "./prisma.js";

export default deleteScript = async () => {
  const users = await prisma.user.findMany();
  await prisma.user.deleteMany({
    where: { id: { in: users.map((u) => u.id) } },
  });
  console.log("Database reset complete.");
};

export const createScript = async () => {
  //Create three users

  await prisma.user.createMany({
    data: [
      {
        name: "test1",
        email: "test1@gmail.com",
        hashedPassword: "test1",
      },
      {
        name: "tes2",
        email: "tes2@gmail.com",
        hashedPassword: "test2",
      },
      {
        name: "test3",
        email: "test3@gmail.com",
        hashedPassword: "test3",
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
