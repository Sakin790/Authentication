import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import { healthCheck } from "./routes/health.js";

const app = express();
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/health",healthCheck)

export default app;
