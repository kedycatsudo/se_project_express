const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const User = require("../models/user");

const errors = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const successStatuses = require("../utils/succeesStatuses");

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!password || typeof password !== "string" || password.length < 3) {
    return res
      .status(errors.BAD_REQUEST_ERROR_CODE)
      .send({ message: "Password is required and must fill" });
  }
  return bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        return res.status(successStatuses.CREATED_SUCCESS_CODE).send(userObj);
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res
            .status(errors.BAD_CONFLICT_ERROR_CODE)
            .send({ message: "A user with this email already exist" });
        }
        if (err.name === "ValidationError") {
          return res
            .status(errors.BAD_REQUEST_ERROR_CODE)
            .send({ message: "Validation failed" });
        }
        return res
          .status(errors.INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "An error has occurred on the server" });
      })
  );
};
const getCurrentUser = (req, res) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return res
          .status(errors.NOT_FOUND_ERROR_CODE)
          .send({ message: "User Not Found" });
      }
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(successStatuses.OK_SUCCESS_CODE).send(userObj);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      return res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};
const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(errors.BAD_REQUEST_ERROR_CODE)
      .send({ message: "The password and email fields are required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(successStatuses.OK_SUCCESS_CODE).send({ token });
      // authentication successStatuses! user is in the user variable
    })
    .catch((err) => {
      if (err.code === 401) {
        res
          .status(errors.UNAUTHORIZED__ERROR_CODE)
          .send({ message: "Unauthorize" });
      }
      // authentication error
      return res
        .status(errors.UNAUTHORIZED__ERROR_CODE)
        .send({ err, message: "Incorrect email or password" });
    });
};
const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return res
          .status(errors.NOT_FOUND_ERROR_CODE)
          .send({ message: "User Not Found" });
      }
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(successStatuses.OK_SUCCESS_CODE).send(userObj);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: "Validation failed" });
      }
      if (err.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      return res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};
module.exports = { createUser, getCurrentUser, login, updateProfile };
