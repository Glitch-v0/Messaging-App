import app from "../app";
import request from "supertest";
import { deleteScript, userTokenScript } from "../queries/testScripts";
import prisma from "../prisma/prisma";

beforeEach(async () => {
  await deleteScript();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("user can get friends", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await prisma.friendList.create({
    data: {
      ownerId: user1.id,
      friends: {
        connect: [{ id: user2.id }, { id: user3.id }],
      },
    },
  });

  const agent = request.agent(app);

  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: user1.email,
      password: "test0",
    })
    .expect(200)
    .expect("set-cookie", /token=.*/);

  await agent
    .get("/api/friends")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect({
      friends: [
        { id: user2.id, name: user2.name },
        { id: user3.id, name: user3.name },
      ],
    });
});

test("user can get blocked users", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await prisma.friendList.create({
    data: {
      ownerId: user1.id,
      blocked: {
        connect: { id: user2.id, id: user3.id },
      },
    },
  });

  request(app)
    .get("/api/blocked")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect({
      blocked: [user2, user3],
    });
});
