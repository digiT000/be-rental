import express from "express";
import cors from "cors";

import "dotenv/config";

import db from "./config/postgres.js";
import authRouter from "./router/auth.router.js";
import handleError from "./utils/handleError.js";
import cookieParser from "cookie-parser";
import helmet from "helmet";

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: [`${process.env.FE_URL}`],
    credentials: true,
  })
);
app.use(express.json());

// Try Connect db
db.query("SELECT NOW()")
  .then(() => {
    console.log("DB confirmed connected");
  })
  .catch(() => {
    console.log("DB confirmed failed to connect");
  });

// Auth
app.use("/api/auth", authRouter);

// Error Handler

app.use(handleError);

app.listen(process.env.PORT, () => {
  console.log("Listening port", process.env.PORT);
});
