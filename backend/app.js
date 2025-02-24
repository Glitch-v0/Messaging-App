import express, { json, urlencoded } from "express";
import router from "./routers/router.js";
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));

app.use((req, res, next) => {
  // console.log(`Route called: ${req.method} ${req.originalUrl}`);
  // console.log(`From origin: ${req.get("origin")}`);
  next();
});

function errorHandler(err, req, res, next) {
  if (err) {
    res.status(500);
    res.render("error", { error: err });
  }
  next();
}

app.use(errorHandler);
app.use("/", router);

export default app;
