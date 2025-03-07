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

  await request(app)
    .get("/api/profile")
    .set("Authorization", `Bearer ${user1.token}`)
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

  await request(app)
    .put("/api/profile")
    .set("Authorization", `Bearer ${user1.token}`)
    .type("form")
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

  await request(app)
    .delete("/api/profile")
    .set("Authorization", `Bearer ${user1.token}`)
    .type("form")
    .send({
      password: "test0",
    })
    .expect(200);
});
