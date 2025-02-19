import app from "./app";
import request from "supertest";

test("Ping route", (done) => {
  request(app)
    .get("/api/ping")
    .expect('"pong"')
    .expect("Content-Type", /json/)
    .expect(200, done);
});

test("API Shows routes", (done) => {
  request(app)
    .get("/api")
    .expect("Content-Type", /json/)
    .expect((res) => {
      expect(res.body.length).toBeGreaterThan(1);
      expect(res.body.length).toBeLessThan(10 ** 100);
      console.log(res.body[1]);
    })
    .expect(200, done);
});
