import express from "express";
import { postProductHandler, getAllProductHandler } from "../handlers/ProductHandler.js";

let router = express.Router();

router.get("/", getAllProductHandler);
router.post("/", postProductHandler);

export default router;
