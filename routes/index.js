const router = require("express").Router();

const errors = require("../utils/errors");

const ItemRouter = require("./clothingItem");

const { createUser, login } = require("../controllers/users");

router.use("/items", ItemRouter);

const userRouter = require("./users");

router.use("/users", userRouter);
router.post("/signup", createUser);
router.post("/signin", login);

router.use((req, res) => {
  res
    .status(errors.NOT_FOUND_ERROR_CODE)
    .send({ message: "Requested resource not found" });
});
module.exports = router;
