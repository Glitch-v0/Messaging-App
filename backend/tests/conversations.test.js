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

test("users can create a conversation with friends", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await userQueries.addFriend(user1.id, user2.id);
  await userQueries.addFriend(user1.id, user3.id);
  await userQueries.addFriend(user2.id, user3.id);

  const agent = request.agent(app);
  agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  agent
    .post(`/api/conversations`)
    .type("form")
    .send({
      participants: [user1.id, user2.id, user3.id],
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

test("users can't create conversations if all participants are not friends", async () => {
  const [user1, user2, user3] = await userTokenScript(3);
  await userQueries.addFriend(user1.id, user2.id);

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .post(`/api/conversations`)
    .type("form")
    .send({
      participants: [user2.id, user3.id],
      message: "hello",
    })
    .expect("Content-Type", /json/)
    .expect(403)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          error: "All users must be friends to create a group conversation",
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

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .get(`/api/conversations`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: conversation1.id,
            messages: expect.anything(),
            participants: [{ name: user2.name }],
          }),
          expect.objectContaining({
            id: conversation2.id,
            messages: expect.anything(),
            participants: [{ name: user3.name }],
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

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .post(`/api/conversations/${conversation.id}/messages`)
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

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .get(`/api/conversations/${conversation.id}`)
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

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .delete(`/api/conversations/${conversation.id}`)
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

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent.get(`/api/conversations/${conversation.id}`).expect(404);
});

test("users can edit a message", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  const message = conversation.messages[0];

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .put(`/api/conversations/${conversation.id}/messages/${message.id}`)
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
        })
      );
    });
});

test("users can delete a message", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  const message = conversation.messages[0];

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .delete(`/api/conversations/${conversation.id}/messages/${message.id}`)
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

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .patch(
      `/api/conversations/${conversation.id}/messages/${message.id}/reaction`
    )
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

test("user can change their message reaction", async () => {
  const [user1, user2] = await userTokenScript(2);
  const conversation = await userQueries.createConversation(
    [user1.id, user2.id],
    user1.id,
    "hello"
  );

  const message = conversation.messages[0];
  await userQueries.reactToMessage(user1.id, message.id, "like");

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .patch(
      `/api/conversations/${conversation.id}/messages/${message.id}/reaction`
    )
    .type("form")
    .send({ reactionType: "dislike" })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          type: "dislike",
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

  const agent = request.agent(app);
  await agent
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);

  await agent
    .delete(
      `/api/conversations/${conversation.id}/messages/${message.id}/reaction`
    )
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          type: "like",
          id: expect.any(Number),
          messageId: message.id,
          userId: user1.id,
        })
      );
    });
});
