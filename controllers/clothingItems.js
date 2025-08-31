const clothingItem = require("../models/clothingItem");

const succeesStatuses = require("../utils/succeesStatuses");

const errors = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({
      name: name,
      weather: weather,
      imageUrl: imageUrl,
      owner: req.user._id,
    })
    .then((item) => {
      res.status(succeesStatuses.CREATED_SUCCESS_CODE).send({ data: item });
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
    .then((items) => res.status(200).send(items))
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

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imgURL } = req.body;
  clothingItem
    .findByIdAndUpdate(itemId, { $set: { imgURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: "Invalid ID format" });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(errors.NOT_FOUND_ERROR_CODE)
          .send({ message: "Resource not found" });
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
          .status(403)
          .send({ message: "You do not have permission to delete this item." });
      }
      return clothingItem.findByIdAndDelete(itemId).then(() => {
        res
          .status(succeesStatuses.OK_SUCCESS_CODE)
          .send({ message: `item  deleted.` });
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
module.exports = { createItem, getItems, updateItem, deleteItem };
