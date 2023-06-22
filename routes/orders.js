import express from "express";
import { postOrderHandler, getAllOrderHandler, getAllOrderHandlerByAdmin, updateOrderHandler, getOrderById, deleteOrderById } from "../handlers/OrderHandler.js";

let router = express.Router();

router.get("/", getAllOrderHandler);
router.get("/:id", getOrderById);
router.get("/order", getAllOrderHandlerByAdmin);
router.post("/", postOrderHandler);
router.put("/:id", updateOrderHandler);
router.delete("/:id", deleteOrderById);

export default router;
