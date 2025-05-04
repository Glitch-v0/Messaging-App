import app from "../app";
import request from "supertest";
import prisma from "../prisma/prisma";
import {
  createScript,
  deleteScript,
  userTokenScript,
} from "../queries/testScripts";

beforeEach(async () => {
  await deleteScript();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("register creates a user receives the name back", async () => {
  await createScript();
  await request(app)
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
});

test("login returns a cookie", async () => {
  await userTokenScript(1);

  await request
    .agent(app)
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("set-cookie", /token=.*/)
    .expect(200);
});

test("cannot login to account that doesn't exist", async () => {
  await request(app)
    .post("/api/login")
    .type("form")
    .send({
      email: "test0@gmail.com",
      password: "test0",
    })
    .expect("Content-Type", /json/)
    .expect(401)
    .expect((res) => {
      expect(res.body).toEqual({
        error: "Credentials do not match any user",
      });
    });
});
