import app from "../app";
import request from "supertest";
import { deleteScript, userTokenScript } from "../queries/testScripts";
import prisma from "../prisma/prisma";
import userQueries from "../queries/userQueries";
import requestQueries from "../queries/requestQueries";

beforeEach(async () => {
  await deleteScript();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("users can send friend requests", async () => {
  const [user1, user2] = await userTokenScript(2);
  await request(app)
    .post(`/api/requests`)
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
          id: expect.any(String),
          senderId: user1.id,
          receiverId: user2.id,
          dateSent: expect.any(String),
        })
      );
    });
});

test("user can get friend requests", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await prisma.request.createMany({
    data: [
      { senderId: user1.id, receiverId: user3.id },
      { senderId: user2.id, receiverId: user3.id },
    ],
  });
  await request(app)
    .get(`/api/requests`)
    .set("Authorization", `Bearer ${user3.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            senderId: user1.id,
            receiverId: user3.id,
            dateSent: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
            senderId: user2.id,
            receiverId: user3.id,
            dateSent: expect.any(String),
          }),
        ])
      );
    });
});

test("user can see all sent requests", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await prisma.request.createMany({
    data: [
      { senderId: user1.id, receiverId: user2.id },
      { senderId: user1.id, receiverId: user3.id },
    ],
  });
  await request(app)
    .get(`/api/requests/sent`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            senderId: user1.id,
            receiverId: user2.id,
            dateSent: expect.any(String),
          }),
          expect.objectContaining({
            id: expect.any(String),
            senderId: user1.id,
            receiverId: user3.id,
            dateSent: expect.any(String),
          }),
        ])
      );
    });
});

test("user can see one request's details", async () => {
  const [user1, user2] = await userTokenScript(2);
  const friendRequest = await prisma.request.create({
    data: {
      senderId: user1.id,
      receiverId: user2.id,
    },
  });
  await request(app)
    .get(`/api/requests/${friendRequest.id}`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect({
      id: friendRequest.id,
      senderId: user1.id,
      receiverId: user2.id,
      dateSent: friendRequest.dateSent.toISOString(),
    });
});

test("users don't see requests from blocked users", async () => {
  const [user1, user2] = await userTokenScript(2);
  await userQueries.addBlocked(user1.id, user2.id);
  await requestQueries.sendFriendRequest(user2.id, user1.id);

  await request(app)
    .get(`/api/requests`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect([]);
});

test("user can accept friend request", async () => {
  const [user1, user2] = await userTokenScript(2);
  const friendRequest = await prisma.request.create({
    data: {
      senderId: user1.id,
      receiverId: user2.id,
    },
  });
  const response = await request(app)
    .get(`/api/requests/${friendRequest.id}/accept`)
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
});

test("user can reject friend request", async () => {
  const [user1, user2] = await userTokenScript(2);
  const friendRequest = await prisma.request.create({
    data: {
      senderId: user1.id,
      receiverId: user2.id,
    },
  });
  await request(app)
    .get(`/api/requests/${friendRequest.id}/reject`)
    .set("Authorization", `Bearer ${user2.token}`)
    .expect("Content-Type", /json/)
    .expect(200);
  expect({
    id: friendRequest.id,
    senderId: user1.id,
    receiverId: user2.id,
    dateSent: friendRequest.dateSent.toISOString(),
  });
});
