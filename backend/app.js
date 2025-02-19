import express, { json, urlencoded } from "express";
// import { initialize } from "passport";
import router from "./routers/router.js";

const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use("/", router);

export default app;
