import express from "express";
import { register, login } from "../handlers/UserHandler.js";

let router = express.Router();

router.post("/login", login);
router.post("/register", register);

export default router;
