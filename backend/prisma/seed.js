import prisma from "./prisma.js";
import { createScript, deleteScript } from "../queries/testScripts.js";

async function main() {
  console.log("Seeding database...");
  await deleteScript();
  await createScript();
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seeding complete!");
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
