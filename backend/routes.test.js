import app from "./app";
import request from "supertest";
import { deleteScript, userTokenScript } from "./queries/testScripts";
import { createToken } from "./utils/tokenUtils";
import requestQueries from "./queries/requestQueries";
import userQueries from "./queries/userQueries";
import { createHash } from "./hashFunctions";
import prisma from "./prisma/prisma";

beforeEach(async () => {
  await deleteScript();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("Ping route", (done) => {
  request(app)
    .get("/ping")
    .expect('"pong"')
    .expect("Content-Type", /json/)
    .expect(200, done);
});

test("API Shows routes", (done) => {
  const routes = request(app)
    .get("/")
    .expect("Content-Type", /json/)
    .expect((res) => {
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body.length).toBeLessThan(10 ** 100);
    })
    .expect(200, done);
});

test("register creates a user receives the name back", async () => {
  const res = await request(app)
    .post("/api/register")
    .type("form")
    .send({
      name: "test",
      email: "test@gmail.com",
      password: "test",
    })
    .expect("Content-Type", /json/)
    .expect(200);

  // Ensure response has name in it
  expect(res.body.name).toBe("test");
}, 1500);

test("login returns a JWT", async () => {
  request(app)
    .post("/api/login")
    .type("form")
    .send({
      email: "test@gmail.com",
      password: "test",
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect({ token: expect.anything() });
}, 1000);

test("users can send friend requests", async () => {
  const [user1, user2] = await userTokenScript(2);
  await request(app)
    .post(`/api/request`)
    .set("Authorization", `Bearer ${user1.token}`)
    .type("form")
    .send({
      receiverId: user2.id,
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          senderId: user1.id,
          receiverId: user2.id,
          dateSent: expect.anything(),
        })
      );
    });
}, 1500);

test("user can get friend requests", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await prisma.request.createMany({
    data: [
      { senderId: user1.id, receiverId: user3.id },
      { senderId: user2.id, receiverId: user3.id },
    ],
  });
  await request(app)
    .get(`/api/request`)
    .set("Authorization", `Bearer ${user3.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            senderId: user1.id,
            receiverId: user3.id,
            dateSent: expect.anything(),
          }),
          expect.objectContaining({
            id: expect.anything(),
            senderId: user2.id,
            receiverId: user3.id,
            dateSent: expect.anything(),
          }),
        ])
      );
    });
}, 1000);

test("user can see all sent requests", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await prisma.request.createMany({
    data: [
      { senderId: user1.id, receiverId: user2.id },
      { senderId: user1.id, receiverId: user3.id },
    ],
  });
  await request(app)
    .get(`/api/request/sent`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            senderId: user1.id,
            receiverId: user2.id,
            dateSent: expect.anything(),
          }),
          expect.objectContaining({
            id: expect.anything(),
            senderId: user1.id,
            receiverId: user3.id,
            dateSent: expect.anything(),
          }),
        ])
      );
    });
}, 1000);

test("user can see one request's details", async () => {
  const [user1, user2] = await userTokenScript(2);
  const friendRequest = await prisma.request.create({
    data: {
      senderId: user1.id,
      receiverId: user2.id,
    },
  });
  await request(app)
    .get(`/api/request/${friendRequest.id}`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect({
      id: friendRequest.id,
      senderId: user1.id,
      receiverId: user2.id,
      dateSent: friendRequest.dateSent.toISOString(),
    });
}, 1000);

test("user can accept friend request", async () => {
  const [user1, user2] = await userTokenScript(2);
  const friendRequest = await prisma.request.create({
    data: {
      senderId: user1.id,
      receiverId: user2.id,
    },
  });
  const response = await request(app)
    .get(`/api/request/${friendRequest.id}/accept`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200);
  expect(response.body).toEqual({
    deletedRequest: {
      id: friendRequest.id,
      senderId: user1.id,
      receiverId: user2.id,
      dateSent: friendRequest.dateSent.toISOString(),
    },
    newFriend: {
      id: expect.any(String),
      ownerId: user2.id,
    },
  });
}, 1000);

test("user can reject friend request", async () => {
  const [user1, user2] = await userTokenScript(2);
  const friendRequest = await prisma.request.create({
    data: {
      senderId: user1.id,
      receiverId: user2.id,
    },
  });
  await request(app)
    .get(`/api/request/${friendRequest.id}/reject`)
    .set("Authorization", `Bearer ${user2.token}`)
    .expect("Content-Type", /json/)
    .expect(200);
  expect({
    id: friendRequest.id,
    senderId: user1.id,
    receiverId: user2.id,
    dateSent: friendRequest.dateSent.toISOString(),
  });
}, 1000);

test("user can get friends", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await prisma.friendList.create({
    data: {
      ownerId: user1.id,
      friends: {
        connect: { id: user2.id, id: user3.id },
      },
    },
  });

  request(app)
    .get("/api/friends")
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect({
      friends: [user2, user3],
    });
}, 1000);

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
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect({
      blocked: [user2, user3],
    });
}, 1000);
