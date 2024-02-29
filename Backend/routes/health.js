import { health } from "../controllers/health.js";
import express from "express";

const healthCheck = express.Router();
healthCheck.get("/", health);

export { healthCheck };
