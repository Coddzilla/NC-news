const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");

app.use(bodyParser.json());
app.use("/api", apiRouter);

app.use((err, req, res, next) => {
  if (err.code) {
    res.status(err.code).send({ msg: `Sorry there was a ${err.code} error!` });
  } else {
    res
      .status(500)
      .send({ msg: `Sorry there was a server error! ${err.code}` });
  }
});

module.exports = app;
