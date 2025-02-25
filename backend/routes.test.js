import app from "./app";
import request from "supertest";
import { createScript, deleteScript } from "./prisma/seed";
import { decodeToken } from "./utils/tokenUtils";

await deleteScript();
await createScript();
let token;
let userId;

test("Ping route", (done) => {
  request(app)
    .get("/ping")
    .expect('"pong"')
    .expect("Content-Type", /json/)
    .expect(200, done);
});

test("API Shows routes", (done) => {
  request(app)
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
}, 500);

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
}, 1500);

test("user can get conversations", async () => {
  // console.log({ token, userId });
  const response = await request(app)
    .get(`/api/${userId}/conversations`)
    .set("Authorization", `Bearer ${token}`);
  console.log(response.body.conversations);
  expect(response.body.conversations.length);
}, 1000);

test("user cannot access other user's routes", async () => {
  await request(app)
    .get(`/api/1/conversations`)
    .set("Authorization", `Bearer ${token}`)
    .expect(403);
});

test("user cannot access protected routes without token", async () => {
  await request(app).get(`/api/${userId}/conversations`).expect(401);
});
