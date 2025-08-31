const errors = require("../utils/errors");
module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer")) {
    return res
      .status(errors.UNAUTHORIZED__ERROR_CODE)
      .send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");
  let payload;
  try {
    payload = jwt.verify(token, "some-secret-key");
    req.user = payload; // store payload in request
    next(); // pass control to the next middleware
  } catch (err) {
    return res
      .status(errors.UNAUTHORIZED__ERROR_CODE)
      .send({ message: "Authorization required" });
  }
  // all the auth will go here
};
