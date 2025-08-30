const mongoose = require("mongoose");

const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 2, maxlength: 30 },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not a valid",
    },
  },
  email: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Email is not valid.",
    },
  },
  password: { type: String, required: true },
});
module.exports = mongoose.model("user", userSchema);
