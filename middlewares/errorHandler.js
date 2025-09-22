function errorHandler(err, req, res, next) {
  // If the error has a status or statusCode property, use it; otherwise default to 500
  const statusCode = err.status || err.statusCode || 500;
  // Use the error's message, or a generic message for server errors
  const message =
    statusCode === 500 ? "An error occurred on the server" : err.message;

  res.status(statusCode).send({ message });
}

module.exports = errorHandler;
