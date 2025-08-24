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
const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => {
      res.status(errors.CREATED_SUCCESS_CODE).send(user);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      return res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
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
module.exports = { getUsers, createUser, getUser };
