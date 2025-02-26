import app from "./app";
import request from "supertest";
import { createScript, deleteScript } from "./prisma/seed";
import { decodeToken } from "./utils/tokenUtils";
import { response } from "express";

await deleteScript();
// await createScript();
let token;
let token2;
let token3;
let userId;
let user2Id;
let user3Id;

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
  // console.log({ token, userId });
  const response = await request(app)
    .get(`/api/conversation`)
    .set("Authorization", `Bearer ${token}`);
  console.log(response.body.conversations);
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

test("user can send friend request", async () => {
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
}, 1000);

// test("user can get friend request, async", async () => {});
