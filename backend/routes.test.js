import app from "./app";
import request from "supertest";
import { createScript, deleteScript } from "./queries/testScripts";
import { decodeToken } from "./utils/tokenUtils";
import { requestQueries } from "./queries/requestQueries";
import { userQueries } from "./queries/userQueries";

// beforeEach(async () => {
//   await deleteScript();
//   await createScript();
// });

await deleteScript();
let token;
let token2;
let token3;
let userId;
let user2Id;
let user3Id;
let friendRequestId;
let friendRequestId2;
let friendRequestId3;

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

  user2Id = await request(app)
    .post("/api/register")
    .type("form")
    .send({
      name: "test2",
      email: "test2@gmail.com",
      password: "test",
    })
    .expect("Content-Type", /json/)
    .expect(200);

  user3Id = await request(app)
    .post("/api/register")
    .type("form")
    .send({
      name: "test3",
      email: "test3@gmail.com",
      password: "test",
    })
    .expect("Content-Type", /json/)
    .expect(200);
  user2Id = user2Id.body.id;
  user3Id = user3Id.body.id;
}, 1500);

test("login returns a valid JWT", async () => {
  const response = await request(app)
    .post("/api/login")
    .type("form")
    .send({
      email: "test@gmail.com",
      password: "test",
    })
    .expect("Content-Type", /json/)
    .expect(200);
  token = response.body.token;
  userId = decodeToken(token).id;

  const response2 = await request(app)
    .post("/api/login")
    .type("form")
    .send({
      email: "test2@gmail.com",
      password: "test",
    })
    .expect("Content-Type", /json/)
    .expect(200);
  token2 = response2.body.token;

  const response3 = await request(app)
    .post("/api/login")
    .type("form")
    .send({
      email: "test3@gmail.com",
      password: "test",
    })
    .expect("Content-Type", /json/)
    .expect(200);
  token3 = response3.body.token;
}, 1500);

test("user can get conversations", async () => {
  const response = await request(app)
    .get(`/api/conversation`)
    .set("Authorization", `Bearer ${token}`);
  // console.log(response.body.conversations);
  expect(response.body.conversations.length);
}, 1000);

// test("user cannot access other user's routes", (done) => {
//   request(app)
//     .get(`/api/1/conversation`)
//     .set("Authorization", `Bearer ${token}`)
//     .expect(403, done);
// });

// test("user cannot access protected routes without token", (done) => {
//   request(app).get(`/api/${userId}/conversation`).expect(401, done);
// });

test("users can send friend requests", async () => {
  await request(app)
    .post(`/api/request`)
    .set("Authorization", `Bearer ${token}`)
    .type("form")
    .send({
      receiverId: user2Id,
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          senderId: userId,
          receiverId: user2Id,
          dateSent: expect.anything(),
        })
      );
    });
  await request(app)
    .post(`/api/request`)
    .set("Authorization", `Bearer ${token3}`)
    .type("form")
    .send({
      receiverId: user2Id,
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.anything(),
          senderId: user3Id,
          receiverId: user2Id,
          dateSent: expect.anything(),
        })
      );
    });
}, 1000);

test("user can get friend requests, async", async () => {
  await request(app)
    .get(`/api/request`)
    .set("Authorization", `Bearer ${token2}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            senderId: userId,
            receiverId: user2Id,
            dateSent: expect.anything(),
          }),
          expect.objectContaining({
            id: expect.anything(),
            senderId: user3Id,
            receiverId: user2Id,
            dateSent: expect.anything(),
          }),
        ])
      );
      friendRequestId = res.body[0].id;
      friendRequestId2 = res.body[1].id;
    });
}, 1000);

test("user can see all sent requests", async () => {
  await request(app)
    .get(`/api/request/sent`)
    .set("Authorization", `Bearer ${token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.anything(),
            senderId: userId,
            receiverId: user2Id,
            dateSent: expect.anything(),
          }),
        ])
      );
    });
}, 1000);

test("user can see one request's details", async () => {
  await request(app)
    .get(`/api/request/${friendRequestId}`)
    .set("Authorization", `Bearer ${token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          id: friendRequestId,
          senderId: userId,
          receiverId: user2Id,
          dateSent: expect.anything(),
        })
      );
    });
}, 1000);

test("user can accept friend request", async () => {
  await request(app)
    .get(`/api/request/${friendRequestId}/accept`)
    .set("Authorization", `Bearer ${token2}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          deletedRequest: expect.anything(),
          newFriend: expect.anything(),
        })
      );
    });
}, 1000);

test("user can reject friend request", async () => {
  console.log({ friendRequestId, friendRequestId2 });
  await request(app)
    .get(`/api/request/${friendRequestId2}/reject`)
    .set("Authorization", `Bearer ${token2}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          deletedRequest: expect.anything(),
          blockedUser: expect.anything(),
        })
      );
      console.log(res.body);
    });
}, 1000);
