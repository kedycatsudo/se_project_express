const router = require("express").Router();
const { likeItem, dislikeItem } = require("../controllers/likes");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");
//CRUD

//CREATE
router.post("/", createItem);

//READ
router.get("/", getItems);
//UPDATE
router.put("/:itemId", updateItem);

//DELETE
router.delete("/:itemId", deleteItem);

//LIKES
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
module.exports = router;
