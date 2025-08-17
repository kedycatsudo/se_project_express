const router = require("express").Router();
const ItemRouter = require("./clothingItem");
const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", ItemRouter);
router.use((req, res) => {
  res.status(500).send({ message: "Router not found" });
});
module.exports = router;
