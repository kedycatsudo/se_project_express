// Hello, I realized that .catch block is repeating. I was thinking to write
// a function that takes the catch as an argumant and filter this .catch((err) => {
// if (err.name === "CastError") {
// return res
//  .status(errors.BAD_REQUEST_ERROR_CODE)
//  .send({ message: "Invalid ID format" });
// }
// if (err.name === "ValidationError") {
//  return res.status(errors.BAD_REQUEST_ERROR_CODE).send({ message: "Validation failed" });
//  }
//  if (err.name === "DocumentNotFoundError") {
//    return res.status(errors.NOT_FOUND_ERROR_CODE).send({ message: "Resource not found" });
//  }
//  return res.status(errors.INTERNAL_SERVER_ERROR_CODE).send({ message: "An error has occurred on the server" });
// });
// and return the neccesary one. That would fix visual problem in the code, that would make it also dynamic.

const clothingItem = require("../models/clothingItem");

const errors = require("../utils/errors");

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({
      name: req.body.name,
      weather: req.weather,
      imageUrl: req.imageUrl,
      owner: req.user._id,
    })
    .then((item) => {
      res.status(errors.CREATED_SUCCESS_CODE).send({ data: item });
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
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(errors.OK_SUCCESS_CODE).send({ message: `item  deleted.` });
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
