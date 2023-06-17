import express from "express";
import { register, login, refreshToken } from "../handlers/UserHandler.js";

let router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh-token", refreshToken);

export default router;
