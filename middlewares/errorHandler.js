function errorHandler(err, req, res, next) {
  const statusCode = err.status || err.statusCode || 500;
  const message =
    statusCode === 500 ? "An error occurred on the server" : err.message;
  if (statusCode === 500) {
    console.error("SERVER ERROR:", err); // Add this line!
    console.log(req.body);
  }
  res.status(statusCode).send({ message });
}

module.exports = errorHandler;
