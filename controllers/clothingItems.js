const clothingItem = require("../models/clothingItem");

const successStatuses = require("../utils/succeesStatuses");

const errors = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({
      name,
      weather,
      imageUrl,
      owner: req.user._id,
    })
    .then((item) => {
      res.status(successStatuses.CREATED_SUCCESS_CODE).send({ data: item });
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: "Validation failed" });
      }
      return res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(successStatuses.OK_SUCCESS_CODE).send(items))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid ID format" });
      }
      return res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (!item.owner.equals(req.user._id)) {
        return res
          .status(errors.FORBIDDEN_ERROR_CODE)
          .send({ message: "You do not have permission to delete this item." });
      }
      return clothingItem.findByIdAndDelete(itemId).then(() => {
        res
          .status(successStatuses.OK_SUCCESS_CODE)
          .send({ message: `item deleted.` });
      });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: "No item found with this id." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errors.NOT_FOUND_ERROR_CODE)
          .send({ message: `Item not found` });
      }
      return res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};

module.exports = { createItem, getItems, deleteItem };
