const User = require("../models/user");

const errors = require("../utils/errors");

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
  bcrypt.hash(password, 10).then((hash) =>
    User.create({ name, avatar, email, password })
      .then((user) => {
        const userObj = user.toObject();
        delete userObj.password;
        res.status(errors.CREATED_SUCCESS_CODE).send(userObj);
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
const getUser = (req, res) => {
  const { userId } = req.params;

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
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(`Incorrect password or email`));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error(`Incorrect password or email`));
        }
        res.send({ message: `Everything good!` });
      });
    })
    .catch((err) => {
      res
        .status(errors.BAD_REQUEST_ERROR_CODE)
        .send({ message: `Incorrect password or email'` });
    });
  return;
};
module.exports = { getUsers, createUser, getUser };
