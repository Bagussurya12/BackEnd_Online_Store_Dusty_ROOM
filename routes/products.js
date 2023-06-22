import express from "express";
import { postProductHandler, getAllProductHandler, getAllProductHandlerByAdmin, updateProductHandler, getProductById, deleteProductByIdHandler } from "../handlers/ProductHandler.js";

let router = express.Router();

router.get("/", getAllProductHandler);
router.get("/product", getAllProductHandlerByAdmin);
router.post("/", postProductHandler);
router.put("/:id", updateProductHandler);
router.get("/:id", getProductById);
router.get("/:id", deleteProductByIdHandler);

export default router;
