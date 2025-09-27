require("dotenv").config();

const cors = require("cors");

const { errors } = require("celebrate");

const mongoose = require("mongoose");

const express = require("express");

const errorHandler = require("./middlewares/errorHandler");

const { requestLogger, errorLogger } = require("./middlewares/logger");

const app = express();

// Allow CORS from both React dev ports
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3002"],
    credentials: true,
  })
);
app.use(express.json());
const routes = require("./routes");

const indexRouter = require("./routes/index");

const { PORT = 3001 } = process.env;
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.error(e);
  });

app.use(routes);
app.use(requestLogger); // log all requests

app.use(errorLogger); // log errors

app.use("/", indexRouter);
app.use(errors());
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
