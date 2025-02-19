import app from "./app";
import request from "supertest";

test("Ping route", (done) => {
  request(app)
    .get("/api/ping")
    .expect('"pong"')
    .expect("Content-Type", /json/)
    .expect(200, done);
});
