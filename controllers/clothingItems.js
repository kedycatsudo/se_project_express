const clothingItem = require("../models/clothingItem");
const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  clothingItem
    .create({ name: name, weather: weather, imageUrl: imageUrl })
    .then((item) => {
      res.status(200).send({ data: item });
    })
    .catch((err) => {
      res.status(400).send({ message: "Error from createItem", err });
    });
};

const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: err.message });
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
      res.status(500).send({ message: "Error from updatItem", err })
    );
};
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  clothingItem
    .findByIdAndDelete(itemId)
    .orFail()
    .then(() => {
      res.status(200).send({ message: `item  deleted.` });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(400).send({ message: "No item found with this id.", err });
      } else if (err.name === "DocumentNotFoundError") {
        console.log(err.message);
        res.status(404).send({ message: `Item not found` });
      } else {
        res.status(500).send({ message: "Error from deleteItem", err });
      }
    });
};
module.exports = { createItem, getItems, updateItem, deleteItem };
