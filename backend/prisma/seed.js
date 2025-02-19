import { prisma } from "prisma.js";

const deleteScript = async () => {
  const tables = await prisma.$queryRawUnsafe(
    `SELECT tablename FROM pg_tables WHERE schemaname = 'public'`
  );

  // Convert table names to Prisma model names (if necessary)
  const modelNames = tables.map((t) => t.tablename);

  console.log("Deleting data from tables:", modelNames);

  // Disable foreign key constraints temporarily
  await prisma.$executeRawUnsafe(`SET session_replication_role = 'replica';`);

  // Delete data from each table
  for (const table of modelNames) {
    try {
      await prisma.$executeRawUnsafe(`DELETE FROM "${table}";`);
      console.log(`Cleared table: ${table}`);
    } catch (error) {
      console.error(`Error clearing table ${table}:`, error);
    }
  }

  // Re-enable foreign key constraints
  await prisma.$executeRawUnsafe(`SET session_replication_role = 'origin';`);

  console.log("Database reset complete.");
};

const createScript = async () => {
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
