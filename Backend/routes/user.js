import express from "express";
import { handleUserSignUp } from "../controllers/user.js";

const router = express.Router();

router.post("/", handleUserSignUp);

export { router };
