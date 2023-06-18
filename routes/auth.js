import express from "express";
import { register, login, refreshToken, checkEmail } from "../handlers/UserHandler.js";

let router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/refresh-token", refreshToken);
router.post("/check-email", checkEmail);

export default router;
