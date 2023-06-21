import User from "../models/User.js";
import bcrypt from "bcrypt";
import { isEmailExist, isEmailExistWithUserId } from "../libraries/isEmailExist.js";
import isPhoneNumberExistWithUserId from "../libraries/isPhoneNumberExistWithUserId.js";

const getUsersHandler = async (req, res) => {
  try {
    let find = {
      fullname: { $regex: `^${req.query.search}`, $options: "i" },
    };
    let options = {
      page: req.query.page || 1,
      limit: req.query.limit || 10,
    };
    const Users = await User.paginate(find, options);
    if (!Users) {
      throw {
        code: 404,
        message: "GET_USERS_FAILED",
      };
    }
    return res.status(200).json({
      status: true,
      total: Users.length,
      Users,
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
const addUserHandler = async (req, res) => {
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
    if (!req.body.role) {
      throw { code: 428, message: "ROLE_IS_REQUIRED" };
    }
    // Check Password Is Match
    if (req.body.password !== req.body.retype_password) {
      throw {
        code: 428,
        message: "PASSWORD_MUST_MATCH",
      };
    }
    // check email exist
    const email = await isEmailExist(req.body.email);
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
      role: req.body.role,
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
const updateUserHandler = async (req, res) => {
  try {
    // check Params ID
    if (!req.params.id) {
      throw {
        code: 428,
        message: "ID_IS_REQUIRED",
      };
    }
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
    if (!req.body.role) {
      throw { code: 428, message: "ROLE_IS_REQUIRED" };
    }
    // Check Password Is Match
    if (req.body.password !== req.body.retype_password) {
      throw {
        code: 428,
        message: "PASSWORD_MUST_MATCH",
      };
    }
    // check email exist
    const email = await isEmailExistWithUserId(req.params.id, req.body.email);
    if (email) {
      throw { code: 409, message: "EMAIL_EXIST" };
    }

    // CHECK PHONE NUMBER EXIST
    const phoneNumber = await isPhoneNumberExistWithUserId(req.params.id, req.body.phoneNumber);
    if (phoneNumber) {
      throw {
        code: 409,
        message: "PHONE_NUMBER_EXIST",
      };
    }
    // Hash Password

    let fields = {};
    (fields.fullname = req.body.fullname), (fields.email = req.body.email), (fields.phoneNumber = req.body.phoneNumber), (fields.addres = req.body.addres), (fields.role = req.body.role);

    if (req.body.password) {
      let salt = await bcrypt.genSalt(10);
      let hash = await bcrypt.hash(req.body.password, salt);
      fields.password = hash;
    }

    // UPDATE USER
    const user = await User.findByIdAndUpdate(req.params.id, fields, { new: true });

    if (!user) {
      throw { code: 500, message: "USER_UPDATE_FAILED" };
    }
    return res.status(200).json({
      status: true,
      message: "USER_UPDATE_SUCCESS",
      user: user,
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
const getUserById = async (req, res) => {
  try {
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      throw {
        code: 404,
        message: "USER_NOT_FOUND",
      };
    }
    return res.status(200).json({
      status: true,
      User: user,
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
const deleteUserByIdHandler = async (req, res) => {
  try {
    // check Params ID
    if (!req.params.id) {
      throw { code: 428, message: "ID_IS_REQUIRED" };
    }
    // UPDATE USER
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      throw { code: 500, message: "USER_UPDATE_FAILED" };
    }
    return res.status(200).json({
      status: true,
      message: "USER_DELETE_SUCCESS",
      user: user,
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

export { getUsersHandler, addUserHandler, updateUserHandler, getUserById, deleteUserByIdHandler };
