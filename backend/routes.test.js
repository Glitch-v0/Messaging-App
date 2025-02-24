import app from "./app";
import request from "supertest";
import deleteScript from "./prisma/seed";

deleteScript();
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
  await request(app)
    .post("/api/login")
    .type("form")
    .send({
      email: "test@gmail.com",
      password: "test",
    })
    .expect("Content-Type", /json/)
    .expect(200);
}, 1500);
