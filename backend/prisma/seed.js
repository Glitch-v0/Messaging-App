import prisma from "./prisma.js";
import { createScript, deleteScript } from "./queries/testScripts.js";
import { createHash } from "../hashFunctions.js";

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
