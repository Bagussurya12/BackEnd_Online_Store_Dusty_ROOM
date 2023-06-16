import express from "express";
import { getAllCategoryHandler, postCategoryHandler } from "../handlers/CategoryHandler.js";

let router = express.Router();

router.get("/", getAllCategoryHandler);
router.post("/", postCategoryHandler);

export default router;
