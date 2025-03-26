import app from "../app";
import request from "supertest";
import { deleteScript, userTokenScript } from "../queries/testScripts";
import userQueries from "../queries/userQueries";
import prisma from "../prisma/prisma";

beforeEach(async () => {
  await deleteScript();
});

afterAll(async () => {
  await prisma.$disconnect();
});

test("users see others online", async () => {
  const [user1, user2, user3] = await userTokenScript(3);

  const updateData = {
    darkMode: false,
    showOnline: true,
    allowRequests: true,
  };

  await userQueries.updateProfile(user2.id, updateData);
  await userQueries.updateProfile(user3.id, updateData);

  await request(app)
    .get("/api/online")
    .set("Authorization", `Bearer ${user1.token}`)
    .expect("Content-Type", /json/)
    .expect(200)
    .expect((res) => {
      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: user2.id,
            name: user2.name,
            lastSeen: expect.any(String),
          }),
          expect.objectContaining({
            id: user3.id,
            name: user3.name,
            lastSeen: expect.any(String),
          }),
        ])
      );
    });
});

test("blocked user cannot see the blocker", async () => {
  const [user1, user2, user3] = await userTokenScript(3);

  const updateData = {
    darkMode: false,
    showOnline: true,
    allowRequests: true,
  };

  await userQueries.updateProfile(user2.id, updateData);
  await userQueries.updateProfile(user3.id, updateData);
});
