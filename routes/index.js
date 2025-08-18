const NOT_FOUND = 404;

const router = require("express").Router();

const ItemRouter = require("./clothingItem");

const userRouter = require("./users");

router.use("/users", userRouter);
router.use("/items", ItemRouter);
router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});
module.exports = router;
