const NOT_FOUND = 404;

const router = require("express").Router();

const ItemRouter = require("./clothingItem");

const { createUser, login, getCurrentUser } = require("../controllers/users");

const userRouter = require("./users");

const auth = require("../middlewares/auth");

router.use("/users", userRouter);
router.post("/signup", createUser);
router.post("/signin", login);
router.use("/items", ItemRouter);
router.use(auth);
router.get("/users/me", getCurrentUser);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
  console.log(req.path);
});
module.exports = router;
