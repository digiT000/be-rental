import express, { Application } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";

import { env } from "./config/env.js";
import { pool } from "./config/database.js";
import authRouter from "./router/auth.router.js";
import brandRouter from "./router/brand.router.js";
import handleError from "./utils/handleError.js";

const app: Application = express();

app.use(helmet());
app.use(cookieParser());
app.use(
  cors({
    origin: [env.FE_URL],
    credentials: true,
  })
);
app.use(express.json());

// Try Connect db
pool
  .query("SELECT NOW()")
  .then(() => {
    console.log("DB confirmed connected");
  })
  .catch(() => {
    console.log("DB confirmed failed to connect");
  });

// Routes
app.use("/api/auth", authRouter);
app.use("/api/brand", brandRouter);

// Error Handler
app.use(handleError);

app.listen(env.PORT, () => {
  console.log(`Listening on port ${env.PORT}`);
});
