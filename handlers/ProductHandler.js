import Product from "../models/Product.js";
import Category from "../models/Category.js";
import mongoose from "mongoose";

const getAllProductHandler = async (req, res) => {
  try {
    const products = await Product.find({ status: "active" });

    if (!products) {
      throw {
        code: 500,
        message: "GET_ALL_PRODUCT_FAILED",
      };
    }
    return res.status(200).json({
      status: true,
      total: `${products.length} data PRODUCT`,
      products,
    });
  } catch (err) {
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};
const postProductHandler = async (req, res) => {
  try {
    // to check that the title is not empty
    if (!req.body.title) {
      throw { code: 428, message: "TITLE_IS_REQUIRED" };
    }
    // to check Thumbnail on Product Not Empty
    if (req.file === "undefined") {
      throw {
        code: 428,
        message: "IMAGE_IS_REQUIRED",
      };
    }
    // to check that the PRICE is not empty
    if (!req.body.price) {
      throw { code: 428, message: "PRICE_FOR_PRODUCT_IS_REQUIRED" };
    }
    // to check that the CATEGORY ID is not empty
    if (!req.body.categoryId) {
      throw { code: 428, message: "CATEGORYID_IS_REQUIRED" };
    }
    if (!req.body.description) {
      throw { code: 428, message: "DESCRIPTION_FOR_PRODUCT_IS_REQUIRED" };
    }
    // to check or make sure the title is not the same
    const productExist = await Product.findOne({ title: req.body.title });
    if (productExist) {
      throw {
        code: 428,
        message: "PRODUCT_IS_EXIST",
      };
    }
    if (!req.file) {
      throw {
        code: 428,
        message: "IMAGE_IS_REQUIRED",
      };
    }
    // to change the error message not from mongoose error message default
    if (!mongoose.Types.ObjectId.isValid(req.body.categoryId)) {
      throw {
        code: 500,
        message: "CATEGORYID_INVALID",
      };
    }

    // TO CHECK THERE IS A CATEGORY ID / IS CATEGORY EXIST
    const categoryExist = await Category.findOne({ _id: req.body.categoryId });
    if (!categoryExist) {
      throw {
        code: 428,
        message: "CATEGORY_IS_NOT_EXIST",
      };
    }
    console.log(req.file);

    const title = req.body.title;
    const image = req.file.path;
    const price = req.body.price;
    const categoryId = req.body.categoryId;
    const description = req.body.description;

    const newProduct = new Product({
      title: title,
      image: image,
      price: price,
      categoryId: categoryId,
      description: description,
    });

    const product = await newProduct.save();

    if (!product) {
      throw { code: 500, message: "POST_PRODUCT_FAILED" };
    }
    return res.status(200).json({
      status: true,
      product,
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
const getAllProductHandlerByAdmin = async (req, res) => {
  try {
    let find = {
      title: { $regex: `^${req.query.search}`, $options: "i" },
    };
    let options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };
    const product = await Product.paginate(find, options);
    if (!product) {
      throw {
        code: 404,
        message: "GET_PRODUCTS_FAILED",
      };
    }
    return res.status(200).json({
      status: true,
      total: product.length,
      product,
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
const updateProductHandler = async (req, res) => {
  try {
    // check Params ID
    if (!req.params.id) {
      throw {
        code: 428,
        message: "ID_IS_REQUIRED",
      };
    }
    // to check that the Body is not empty
    if (!req.body.title) {
      throw { code: 428, message: "TITLE_IS_REQUIRED" };
    }
    if (!req.body.description) {
      throw { code: 428, message: "DESCRIPTION_IS_REQUIRED" };
    }

    if (!req.body.price) {
      throw { code: 428, message: "PRICE_IS_REQUIRED" };
    }
    let fields = {};
    fields.title = req.body.title;
    fields.description = req.body.description;
    fields.price = req.body.price;
    // UPDATE USER
    const product = await Product.findByIdAndUpdate(req.params.id, fields, { new: true });

    if (!product) {
      throw { code: 500, message: "PRODUCT_UPDATE_FAILED" };
    }
    return res.status(200).json({
      status: true,
      message: "PRODUCT_UPDATE_SUCCESS",
      product: product,
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
const getProductById = async (req, res) => {
  try {
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw {
        code: 404,
        message: "PRODUCT_NOT_FOUND",
      };
    }
    return res.status(200).json({
      status: true,
      product: product,
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
const deleteProductByIdHandler = async (req, res) => {
  try {
    // check Params ID
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }
    // DELETE PRODUCT
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      throw { code: 500, message: "PRODUCT_DELETE_FAILED" };
    }
    return res.status(200).json({
      status: true,
      message: "PRODUCT_DELETE_SUCCESS",
      Product: product,
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

export { postProductHandler, getAllProductHandler, getAllProductHandlerByAdmin, updateProductHandler, getProductById, deleteProductByIdHandler };
