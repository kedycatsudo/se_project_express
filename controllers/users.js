const User = require("../models/user");

const errors = require("../utils/errors");

const { JWT_SECRET } = require("../utils/config");

const jwt = require("jsonwebtoken");

const successful = require("./../utils/succeesStatuses");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(errors.OK_SUCCESS_CODE).send(users);
    })
    .catch(() => {
      res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};
const bcrypt = require("bcryptjs");
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!password || typeof password !== "string" || password.length < 8) {
    return res
      .status(errors.BAD_REQUEST_ERROR_CODE)
      .send({ message: "Password is required and must fill" });
  }
  bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password: hash })
      .then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        res
          .status(successful.CREATED_SUCCESS_CODE)
          .send({ userObj, message: "User created successfully" });
      })
      .catch((err) => {
        if (err.code === 11000) {
          return res
            .status(409)
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
  const { userId } = req.user;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res
          .status(errors.NOT_FOUND_ERROR_CODE)
          .send({ message: "User Not Found" });
      }
      return res.status(errors.OK_SUCCESS_CODE).send(user);
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
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
      // authentication successful! user is in the user variable
    })
    .catch((err) => {
      // authentication error
      res
        .status(errors.BAD_REQUEST_ERROR_CODE)
        .send({ message: "Incorrect email or password" });
    });
};
module.exports = { getUsers, createUser, getCurrentUser, login };
