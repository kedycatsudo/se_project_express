const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const errors = require("../utils/errors");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(errors.UNAUTHORIZED__ERROR_CODE)
      .send({ message: "Authorization required" });
  }
  const token =
    req.headers.authorization &&
    req.headers.authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res
      .status(errors.UNAUTHORIZED__ERROR_CODE)
      .send({ message: "Authorization required" });
  }
  req.user = payload; // store payload in request
  return next(); // pass control to the next middleware
  // all the auth will go here
};
