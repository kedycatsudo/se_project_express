const express = require("express");
const mongoose = require("mongoose");
const indexRouter = require("./routes/index.js");
const app = express();
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
app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133", // paste the _id of the test user you created
  };
  next();
});
const routes = require("./routes");
app.use(routes);
app.use("/", indexRouter);
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
