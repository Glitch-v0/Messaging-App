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
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual({
        name: "test",
        id: expect.any(String),
      });
    });
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
    .expect({ token: expect.any(String) });
}, 1000);
