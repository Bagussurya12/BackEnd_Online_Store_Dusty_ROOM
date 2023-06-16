import User from "../models/User.js";
import bcrypt from "bcrypt";

const register = async (req, res) => {
  try {
    // to check that the Body is not empty
    if (!req.body.fullname) {
      throw { code: 428, message: "FULLNAME_IS_REQUIRED" };
    }
    if (!req.body.email) {
      throw { code: 428, message: "EMAIL_IS_REQUIRED" };
    }
    if (!req.body.phoneNumber) {
      throw { code: 428, message: "PHONE_NUMBER_IS_REQUIRED" };
    }
    if (!req.body.addres) {
      throw { code: 428, message: "ADDRES_IS_REQUIRED" };
    }
    if (!req.body.password) {
      throw { code: 428, message: "PASSWORD_IS_REQUIRED" };
    }
    // Check Password Is Match
    if (req.body.password !== req.body.retype_password) {
      throw {
        code: 428,
        message: "PASSWORD_MUST_MATCH",
      };
    }
    // check email exist
    const email = await User.findOne({ email: req.body.email });
    if (email) {
      throw {
        code: 409,
        message: "EMAIL_EXIST",
      };
    }
    // CHECK PHONE NUMBER EXIST
    const phoneNumber = await User.findOne({ phoneNumber: req.body.phoneNumber });
    if (phoneNumber) {
      throw {
        code: 409,
        message: "PHONE_NUMBER_EXIST",
      };
    }
    // Hash Password
    let salt = await bcrypt.genSalt(10);
    let hash = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      addres: req.body.addres,
      password: hash,
    });
    const user = await newUser.save();

    if (!user) {
      throw { code: 500, message: "USER_REGISTER_FAILED" };
    }
    return res.status(200).json({
      status: true,
      message: "USER_REGISTER_SUCCESS",
      user,
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

const login = async (req, res) => {
  try {
    // to check that the Body is not empty
    if (!req.body.email) {
      throw { code: 428, message: "EMAIL_IS_REQUIRED" };
    }
    if (!req.body.password) {
      throw { code: 428, message: "PASSWORD_IS_REQUIRED" };
    }

    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      throw {
        code: 404,
        message: "USER_NOT_FOUND",
      };
    }
    // CHECK PASSWORD MATCH ON DB
    const isMatch = await bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      throw {
        code: 409,
        message: "PASSWORD_WRONG",
      };
    }

    return res.status(200).json({
      status: true,
      message: "LOGIN_SUCCESS",
      user: {
        fullname: user.fullname,
        email: user.email,
      },
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
// const getAllCategoryHandler = async (req, res) => {
//   try {
//     const categories = await Category.find({ status: "active" });

//     if (!categories) {
//       throw {
//         code: 500,
//         message: "GET_ALL_CATEGORY_FAILED",
//       };
//     }
//     return res.status(200).json({
//       status: true,
//       total: categories.length,
//       categories,
//     });
//   } catch (err) {
//     return res.status(err.code).json({
//       status: false,
//       message: err.message,
//     });
//   }
// };

export { register, login };
