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
