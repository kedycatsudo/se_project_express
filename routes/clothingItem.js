const router = require("express").Router();
const auth = require("../middlewares/auth");

const { likeItem, dislikeItem } = require("../controllers/likes");

const {
  createItem,
  getItems,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);

router.use(auth);

router.post("/", createItem);

router.put("/:itemId/likes", likeItem);

router.delete("/:itemId/likes", dislikeItem);

router.delete("/:itemId", deleteItem);

module.exports = router;
