import express from "express";
import categories from "./categories.js";
import products from "./products.js";
import auth from "./auth.js";
import users from "./users.js";
import orders from "./orders.js";

var router = express.Router();

router.use("/categories", categories);
router.use("/products", products);
router.use("/auth", auth);
router.use("/users", users);
router.use("/orders", orders);

export default router;
