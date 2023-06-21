import User from "../models/User.js";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv";
import { isEmailExist } from "../libraries/isEmailExist.js";

const env = dotenv.config().parsed;

// Generate Access TOken
const generateAccessToken = async (payload) => {
  return jsonwebtoken.sign(payload, env.JWT_ACCESS_TOKEN_SECRET, { expiresIn: env.JWT_ACCESS_TOKEN_LIFE });
};
const generateRefreshToken = async (payload) => {
  return jsonwebtoken.sign(payload, env.JWT_REFRESH_TOKEN_SECRET, { expiresIn: env.JWT_REFRESH_TOKEN_LIFE });
};

// Check Email :

const checkEmail = async (req, res) => {
  try {
    const email = await isEmailExist(req.body.email);
    if (email) {
      throw { code: 409, message: "EMAIL_EXIST" };
    }
    res.status(200).json({
      status: true,
      message: "EMAIL_NOT_EXIST",
    });
  } catch (err) {
    res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

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
        code: 403,
        message: "USER_NOT_FOUND",
      };
    }
    // CHECK PASSWORD MATCH ON DB
    const isMatch = await bcrypt.compareSync(req.body.password, user.password);
    if (!isMatch) {
      throw {
        code: 403,
        message: "WRONG_PASSWORD",
      };
    }
    // Generate TOken
    const payload = { id: user._id, role: user.role };

    let accessToken = await generateAccessToken(payload);
    let refreshToken = await generateRefreshToken(payload);

    // RESPONSE SUKSES
    return res.status(200).json({
      status: true,
      message: "LOGIN_SUCCESS",
      user: {
        fullname: user.fullname,
        email: user.email,
      },
      fullname: user.fullname,
      accessToken,
      refreshToken,
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

// VERIFY REFRESH TOKEN
const refreshToken = async (req, res) => {
  try {
    if (!req.body.refreshToken) {
      throw { code: 428, message: "REFRESH_TOKEN_IS_REQUIRED" };
    }
    // VERIFY TOKEN
    const verify = await jsonwebtoken.verify(req.body.refreshToken, env.JWT_REFRESH_TOKEN_SECRET);

    let payload = { id: verify.id, role: verify.role };
    // GET token JWT
    const accessToken = await generateAccessToken(payload);
    const refreshToken = await generateRefreshToken(payload);

    return res.status(200).json({
      status: true,
      message: "REFRESH_TOKEN_SUCCES",
      accessToken,
      refreshToken,
    });
  } catch (err) {
    // if (err.message == "jwt expired") {
    //   err.message = "REFRESH_TOKEN_EXPIRED";
    // } else {
    //   err.message = "REFRESH_TOKEN_INVALID";
    // }
    if (!err.code) {
      err.code = 405;
    }
    console.log(err);
    return res.status(err.code).json({
      status: false,
      message: err.message,
    });
  }
};

export { register, login, refreshToken, checkEmail };
