import app from "../app";
import request from "supertest";
import { deleteScript, userTokenScript } from "../queries/testScripts";
import prisma from "../prisma/prisma";
import userQueries from "../queries/userQueries";

beforeEach(async () => {
  await deleteScript();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("users can create a conversation", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await request(app)
    .post(`/api/conversations`)
    .set("Authorization", `Bearer ${user1.token}`)
    .type("form")
    .send({
      participants: [user2.id, user3.id],
      message: "hello",
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          messages: expect.anything(),
          participants: expect.anything(),
        })
      );
    });
});

test("users can get all their conversations", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  const conversation1 = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  const conversation2 = await userQueries.createConversation(
    [user1.id, user3.id],
    user1.id,
    "hello"
  );

  await request(app)
    .get(`/api/conversations`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: conversation1.id,
            participants: [{ name: user1.name }, { name: user2.name }],
          }),
          expect.objectContaining({
            id: conversation2.id,
            participants: [{ name: user1.name }, { name: user3.name }],
          }),
        ])
      );
    });
});

test("users can send a message", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  await request(app)
    .post(`/api/conversations/${conversation.id}`)
    .set("Authorization", `Bearer ${user1.token}`)
    .type("form")
    .send({
      message: "test",
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          content: "test",
          id: expect.any(String),
          sender: expect.objectContaining({ name: "test0" }),
          timestamp: expect.any(String),
        })
      );
    });
});

test("users can delete a conversation", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  await request(app)
    .delete(`/api/conversations/${conversation.id}`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          id: conversation.id,
          participants: [expect.objectContaining({ id: user2.id })],
        })
      );
    });
});
