const clothingItem = require("../models/clothingItem");

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
        return res.status(404).send({ message: "Item not found" });
      }
      res.status(200).send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "ItemId is not valid" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(404).send({ message: `Item is not exist` });
      } else {
        res.status(500).send({ message: err.message });
      }
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
        return res.status(404).send({ message: "item not exist" });
      }
      res.send(item);
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: err.message });
      } else {
        res.status(400().send({ message: err.message }));
      }
    });
};
