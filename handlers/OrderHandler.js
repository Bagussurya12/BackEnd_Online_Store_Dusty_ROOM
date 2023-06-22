import Order from "../models/Order.js";
import mongoose from "mongoose";

const postOrderHandler = async (req, res) => {
  try {
    if (!req.body.customerName) {
      throw { code: 428, message: "CUSTOMER_NAME_IS_REQUIRED" };
    }
    if (!req.body.phoneNumberCustomer) {
      throw { code: 428, message: "PHONE_NUMBER_CUSTOMER_NAME_IS_REQUIRED" };
    }
    if (!req.body.emailCustomer) {
      throw { code: 428, message: "EMAIL_CUSTOMER_NAME_IS_REQUIRED" };
    }
    if (!req.body.shirtColor) {
      throw { code: 428, message: "SHIRT_COLOR_IS_REQUIRED" };
    }
    if (!req.body.shirtMaterial) {
      throw { code: 428, message: "SHIRT_MATERIAL_IS_REQUIRED" };
    }
    if (!req.body.amountOrder) {
      throw { code: 428, message: "AMOUNT_ORDER_IS_REQUIRED" };
    }
    if (!req.file) {
      throw { code: 428, message: "IMAGE_DESIGN_IS_REQUIRED" };
    }
    if (!req.body.printingType) {
      throw { code: 428, message: "PRINTING_TYPE_IS_REQUIRED" };
    }
    if (req.file === "undefined") {
      throw {
        code: 428,
        message: "IMAGE_IS_REQUIRED",
      };
    }
    if (!req.file) {
      throw {
        code: 428,
        message: "IMAGE_IS_REQUIRED",
      };
    }

    const customerName = req.body.customerName;
    const phoneNumber = req.body.phoneNumber;
    const emailCustomer = req.body.emailCustomer;
    const shirtColor = req.body.shirtColor;
    const shirtMaterial = req.body.shirtMaterial;
    const amountOrder = req.body.amountOrder;
    const image = req.file.path;
    const printingType = req.body.printingType;

    const newOrder = new Order({
      customerName: customerName,
      phoneNumber: phoneNumber,
      emailCustomer: emailCustomer,
      shirtColor: shirtColor,
      shirtMaterial: shirtMaterial,
      amountOrder: amountOrder,
      image: image,
      printingType: printingType,
    });

    const order = await newOrder.save();

    if (!order) {
      throw {
        code: 500,
        message: "POST_ORDER_FAILED",
      };
    }
    return res.status(200).json({
      status: true,
      order,
    });
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};
const getAllOrderHandler = async (req, res) => {
  try {
    const orders = await Order.find();

    if (!orders) {
      throw { code: 500, message: "GET_ALL_ORDER_FAILED" };
    }
    return res.status(200).json({
      status: true,
      total: `${orders.length} Data Orders`,
      orders,
    });
  } catch (err) {
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};
const getAllOrderHandlerByAdmin = async (req, res) => {
  try {
    let find = {
      customerName: { $regex: `^${req.query.search}`, $options: "i" },
    };
    let options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };
    const orders = await Order.paginate(find, options);
    if (!orders) {
      throw {
        code: 404,
        message: "GET_ALL_ORDERS_FAILED",
      };
    }
    return res.status(200).json({
      status: true,
      total: orders.length,
      orders,
    });
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};
const updateOrderHandler = async (req, res) => {
  try {
    // Check Params ID
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }
    // CHECK BODY IS NOT EMPTY
    if (!req.body.customerName) {
      throw { code: 428, message: "CUSTOMER_NAME_IS_REQUIRED" };
    }
    if (!req.body.phoneNumberCustomer) {
      throw { code: 428, message: "PHONE_NUMBER_CUSTOMER_NAME_IS_REQUIRED" };
    }
    if (!req.body.emailCustomer) {
      throw { code: 428, message: "EMAIL_CUSTOMER_NAME_IS_REQUIRED" };
    }
    if (!req.body.shirtColor) {
      throw { code: 428, message: "SHIRT_COLOR_IS_REQUIRED" };
    }
    if (!req.body.shirtMaterial) {
      throw { code: 428, message: "SHIRT_MATERIAL_IS_REQUIRED" };
    }
    if (!req.body.amountOrder) {
      throw { code: 428, message: "AMOUNT_ORDER_IS_REQUIRED" };
    }
    // if (!req.file) {
    //   throw { code: 428, message: "IMAGE_DESIGN_IS_REQUIRED" };
    // }
    if (!req.body.printingType) {
      throw { code: 428, message: "PRINTING_TYPE_IS_REQUIRED" };
    }
    // if (req.file === "undefined") {
    //   throw {
    //     code: 428,
    //     message: "IMAGE_IS_REQUIRED",
    //   };
    // }
    if (!req.body.paymentStatus) {
      throw { code: 428, message: "PAYMENT_STATUS_IS_REQUIRED" };
    }
    if (!req.body.orderProcess) {
      throw { code: 428, message: "ORDER_PROCESS_IS_REQUIRED" };
    }
    if (!req.body.status) {
      throw { code: 428, message: "STATUS_IS_REQUIRED" };
    }
    let fields = {};
    fields.customerName = req.body.customerName;
    fields.phoneNumberCustomer = req.body.phoneNumberCustomer;
    fields.emailCustomer = req.body.emailCustomer;
    fields.shirtColor = req.body.shirtColor;
    fields.shirtMaterial = req.body.shirtMaterial;
    fields.amountOrder = req.body.amountOrder;
    fields.printingType = req.body.printingType;
    fields.status = req.body.status;
    fields.paymentStatus = req.body.paymentStatus;
    fields.orderProcess = req.body.orderProcess;

    // Update Order
    const order = await Order.findByIdAndUpdate(req.params.id, fields, { new: true });
    if (!order) {
      throw { code: 500, message: "UPDATE_ORDER_FAILED" };
    }
    return res.status(200).json({
      status: true,
      message: "ORDER_UPDATE_SUCCESS",
      order: order,
    });
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};
const getOrderById = async (req, res) => {
  try {
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      throw {
        code: 404,
        message: "ORDER_NOT_FOUND",
      };
    }
    return res.status(200).json({
      status: true,
      Order: order,
    });
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    console.log(err);
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};
const deleteOrderById = async (req, res) => {
  try {
    // check Params ID
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }

    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) {
      throw {
        code: 500,
        message: "ORDER_DELETE_SUCCESS",
      };
    }
    return res.status(200).json({
      status: true,
      message: "DELETE_ORDER_SUCCESS",
      order: order,
    });
  } catch (err) {
    if (!err.code) {
      err.code = 500;
    }
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};
export { postOrderHandler, getAllOrderHandler, getAllOrderHandlerByAdmin, updateOrderHandler, getOrderById, deleteOrderById };
