const { getUsers, createUser } = require("../controllers/users");

const router = require("express").Router();
router.get("/", getUsers);
router.get("/:userId", () => {
  console.log("GET users by ID");
});
router.post("/", createUser);
module.exports = router;
