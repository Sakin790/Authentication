import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { healthCheck } from "./routes/health.js";
import { router } from "./routes/user.js";

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/health", healthCheck);
app.use("/user", router);

export default app;
