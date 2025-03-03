import app from "../app";
import request from "supertest";
import { deleteScript } from "../queries/testScripts";
import prisma from "../prisma/prisma";

beforeEach(async () => {
  await deleteScript();
});

afterAll(async () => {
  await prisma.$disconnect();
});

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
