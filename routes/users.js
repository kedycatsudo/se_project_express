const router = require("express").Router();
const {
  createUser,
  getCurrentUser,
  login,
  updateProfile,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

// Public routes
router.post("/signup", createUser);
router.post("/signin", login);

// Protected routes
router.get("/me", auth, getCurrentUser);
router.patch("/me", auth, updateProfile);

module.exports = router;
