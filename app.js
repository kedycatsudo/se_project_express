const cors = require("cors");

const express = require("express");

const app = express();
app.use(cors());

const mongoose = require("mongoose");
const indexRouter = require("./routes/index");

const { PORT = 3001 } = process.env;
app.use(express.json());
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((e) => {
    console.error(e);
  });

const routes = require("./routes");

app.use(routes);
app.use("/", indexRouter);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
