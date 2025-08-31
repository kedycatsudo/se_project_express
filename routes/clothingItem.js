const router = require("express").Router();
const auth = require("../middlewares/auth");

const { likeItem, dislikeItem } = require("../controllers/likes");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");
router.get("/", getItems);

router.use(auth);

router.post("/items", createItem);

router.put("/:itemId", updateItem);

router.delete("/:itemId", deleteItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
