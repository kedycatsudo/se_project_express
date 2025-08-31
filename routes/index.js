const NOT_FOUND = 404;

const router = require("express").Router();

const ItemRouter = require("./clothingItem");

const {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
} = require("../controllers/users");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
} = require("../controllers/clothingItems");

const userRouter = require("./users");

const auth = require("../middlewares/auth");

router.use("/users", userRouter);
router.post("/signup", createUser);
router.post("/signin", login);
router.use(auth);
router.get("/users/me", getCurrentUser);
router.patch("/users/me", updateProfile);

router.use("/items", ItemRouter);
router.post("/items", createItem);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});
module.exports = router;
