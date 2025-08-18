const clothingItem = require("../models/clothingItem");

const errors = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({ name, weather, imageUrl, owner: req.user._id })
    .then((item) => {
      res.status(errors.CREATED_SUCCESS_CODE).send({ data: item });
    })
    .catch(() => {
      res
        .status(errors.BAD_REQUEST_ERROR_CODE)
        .send({ message: "Error from createItem" });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
    });
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imgURL } = req.body;
  clothingItem
    .findByIdAndUpdate(itemId, { $set: { imgURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) =>
      res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "Error from updatItem", err })
    );
};
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(errors.OK_SUCCESS_CODE).send({ message: `item  deleted.` });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: "No item found with this id.", err });
      } else if (err.name === "DocumentNotFoundError") {
        console.log(err.message);
        res
          .status(errors.NOT_FOUND_ERROR_CODE)
          .send({ message: `Item not found` });
      } else {
        res
          .status(errors.INTERNAL_SERVER_ERROR_CODE)
          .send({ message: "Error from deleteItem", err });
      }
    });
};
module.exports = { createItem, getItems, updateItem, deleteItem };
