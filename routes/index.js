import express from "express";
import categories from "./categories.js";
import products from "./products.js";
import auth from "./auth.js";

var router = express.Router();

router.use("/categories", categories);
router.use("/products", products);
router.use("/auth", auth);

export default router;
