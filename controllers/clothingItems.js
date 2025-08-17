const ClothingItem = require("../models/clothingItem");
const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);
  const { name, weather, imgUrl } = req.body;
  ClothingItem.create({ name: name, weather: weather, imgUrl: imgUrl }).then(
    (item) => {
      console.log(item);
      res.send({ data: item }).catch((err) => {
        res.status(500).send({ message: "Error from createItem", err });
      });
    }
  );
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send(items))
    .catch((err) => res.status(500).send({ message: "Get Items Failed", err }));
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imgURL } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: { imgURL } })
    .orFail()
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) =>
      res.status(500).send({ message: "Error from updatItem", err })
    );
};
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.status(204).send({}))
    .catch((err) =>
      res.status(500).send({ message: "Error from deleteItem", err })
    );
};
module.exports = { createItem, getItems, updateItem, deleteItem };
