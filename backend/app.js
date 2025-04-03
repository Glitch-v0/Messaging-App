import express, { json, urlencoded } from "express";
import router from "./routers/router.js";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

const app = express();

//Parses json
app.use(json());

//Parses form data
app.use(urlencoded({ extended: true }));

app.use(cookieParser(process.env.JWT_SECRET));

const corsOptions = {
  origin: [process.env.FRONTEND_URL],
  credentials: true,
};

app.use(cors(corsOptions));
app.use((req, res, next) => {
  console.log(`Route called: ${req.method} ${req.originalUrl}`);
  console.log(`From origin: ${req.get("origin")}`);
  next();
});

function errorHandler(err, req, res, next) {
  if (err) {
    res.status(500);
    res.render("error", { error: err });
  }
  next();
}

app.use("/", router);
app.use(errorHandler);

export default app;
