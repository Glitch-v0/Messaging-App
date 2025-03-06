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
    .post(`/api/conversations/${conversation.id}/messages`)
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

test("users can get a conversation", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "test1"
  );

  const message1 = await userQueries.sendMessage(
    conversation.id,
    user1.id,
    "test2"
  );
  const message2 = await userQueries.sendMessage(
    conversation.id,
    user2.id,
    "test3"
  );

  await request(app)
    .get(`/api/conversations/${conversation.id}`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          id: conversation.id,
          messages: expect.arrayContaining([
            expect.objectContaining({
              content: message1.content,
              id: message1.id,
              sender: expect.objectContaining({ name: user1.name }),
              timestamp: expect.any(String),
            }),
            expect.objectContaining({
              content: message2.content,
              id: message2.id,
              sender: expect.objectContaining({ name: user2.name }),
              timestamp: expect.any(String),
            }),
          ]),
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

test("conversations are deleted if both users delete it", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  await userQueries.deleteConversation(conversation.id, user1.id);
  await userQueries.deleteConversation(conversation.id, user2.id);

  await request(app)
    .get(`/api/conversations/${conversation.id}`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect(404);
});

test("users can delete a message", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  const message = conversation.messages[0];

  await request(app)
    .delete(`/api/conversations/${conversation.id}/messages/${message.id}`)
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          content: message.content,
        })
      );
    });
});

test("user can react to a message", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  const message = conversation.messages[0];

  await request(app)
    .patch(
      `/api/conversations/${conversation.id}/messages/${message.id}/reaction`
    )
    .set("Authorization", `Bearer ${user1.token}`)
    .type("form")
    .send({ reactionType: "like" })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          type: "like",
          messageId: message.id,
          userId: user1.id,
        })
      );
    });
});

test("user can remove message reaction", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  const message = conversation.messages[0];
  await userQueries.reactToMessage(user1.id, message.id, "like");
  await request(app)
    .delete(
      `/api/conversations/${conversation.id}/messages/${message.id}/reaction`
    )
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          type: expect.any(String),
          id: expect.any(Number),
          messageId: message.id,
          userId: user1.id,
        })
      );
    });
});
