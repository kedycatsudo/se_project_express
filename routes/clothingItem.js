const router = require("express").Router();
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
router.put("/:itemId", deleteItem);
module.exports = router;
