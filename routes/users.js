import express from "express";
import { getUsersHandler, addUserHandler, updateUserHandler, getUserById, deleteUserByIdHandler } from "../handlers/UsersHandler.js";

let router = express.Router();

router.get("/", getUsersHandler);
router.post("/", addUserHandler);
router.put("/:id", updateUserHandler);
router.get("/:id", getUserById);
router.delete("/:id", deleteUserByIdHandler);

export default router;
