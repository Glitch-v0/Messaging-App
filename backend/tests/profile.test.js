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

test("users can get their profile", async () => {
  const user1 = await userTokenScript(1);

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
    .get("/api/profile")
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          userId: user1.id,
          darkMode: false,
          showOnline: false,
          allowRequests: false,
        })
      );
    });
});

test("users can update their profile", async () => {
  const user1 = await userTokenScript(1);

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
    .put("/api/profile")
    .set("Content-Type", "application/json")
    .send({
      darkMode: true,
      showOnline: true,
      allowRequests: true,
    })
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          userId: user1.id,
          darkMode: true,
          showOnline: true,
          allowRequests: true,
        })
      );
    });
});

test("users can delete their profile", async () => {
  const user1 = await userTokenScript(1);

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
    .delete("/api/profile")
    .type("form")
    .send({
      password: "test0",
    })
    .expect(200);
});
