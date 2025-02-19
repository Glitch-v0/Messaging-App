import express, { json, urlencoded } from "express";
// import { initialize } from "passport";
import router from "./router.js";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/api", router);

export default app;
