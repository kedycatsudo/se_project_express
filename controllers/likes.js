const clothingItem = require("../models/clothingItem");

const successStatuses = require("../utils/succeesStatuses");

const errors = require("../utils/errors");

module.exports.likeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        return res
          .status(errors.NOT_FOUND_ERROR_CODE)
          .send({ message: "Item not found" });
      }
      return res.status(successStatuses.OK_SUCCESS_CODE).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: "ItemId is not valid" });
      } else if (err.name === "DocumentNotFoundError") {
        return res
          .status(errors.NOT_FOUND_ERROR_CODE)
          .send({ message: `Item is not exist` });
      }
      console.log(err);
      return res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};
module.exports.dislikeItem = (req, res) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    )
    .then((item) => {
      if (!item) {
        return res
          .status(errors.NOT_FOUND_ERROR_CODE)
          .send({ message: "item not exist" });
      }
      return res.status(successStatuses.OK_SUCCESS_CODE).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        return res
          .status(errors.BAD_REQUEST_ERROR_CODE)
          .send({ message: err.message });
      }
      console.log(err);
      return res
        .status(errors.INTERNAL_SERVER_ERROR_CODE)
        .send({ message: "An error has occurred on the server" });
    });
};
