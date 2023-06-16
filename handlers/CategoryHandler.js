import Category from "../models/Category.js";

const postCategoryHandler = async (req, res) => {
  try {
    // to check that the title is not empty
    if (!req.body.title) {
      throw { code: 428, message: "TITLE_IS_REQUIRED" };
    }
    const title = req.body.title;
    const newCategory = new Category({
      title: title,
    });
    const category = await newCategory.save();

    if (!category) {
      throw { code: 500, message: "POST CATEGORY FAILED" };
    }
    return res.status(200).json({
      status: true,
      category,
    });
  } catch (err) {
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};
const getAllCategoryHandler = async (req, res) => {
  try {
    const categories = await Category.find({ status: "active" });

    if (!categories) {
      throw {
        code: 500,
        message: "GET_ALL_CATEGORY_FAILED",
      };
    }
    return res.status(200).json({
      status: true,
      total: categories.length,
      categories,
    });
  } catch (err) {
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export { postCategoryHandler, getAllCategoryHandler };
