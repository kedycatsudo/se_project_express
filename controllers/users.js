const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const successStatuses = require("../utils/succeesStatuses");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require("../middlewares/errors/custom_errors");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  if (!password || typeof password !== "string" || password.length < 3) {
    return next(
      new BadRequestError(
        "Password is required and must be at least 3 characters long"
      )
    );
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(successStatuses.CREATED_SUCCESS_CODE).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return next(new ConflictError("A user with this email already exists"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation failed"));
      }
      return next(err);
    });
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User Not Found"));
      }
      const userObj = user.toObject();
      delete userObj.password;
      res.status(successStatuses.OK_SUCCESS_CODE).send(userObj);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new BadRequestError("The password and email fields are required")
    );
  }

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(successStatuses.OK_SUCCESS_CODE).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        return next(new UnauthorizedError("Unauthorized"));
      }
      return next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError("User Not Found"));
      }
      const userObj = user.toObject();
      delete userObj.password;
      res.status(successStatuses.OK_SUCCESS_CODE).send(userObj);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Validation failed"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

module.exports = { createUser, getCurrentUser, login, updateProfile };
