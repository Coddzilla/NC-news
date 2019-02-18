const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const {
  handle400,
  handle500,
  handle404,
  handle422
} = require("./errorHandling");

app.use(cors());
app.use(bodyParser.json());
app.use("/api", apiRouter);

app.use(handle400);
app.use(handle422);
// app.use(handle405);
app.use(handle404);
app.use(handle500);

app.get("/products/:id", function(req, res, next) {
  res.json({ msg: "This is CORS-enabled for all origins!" });
});

app.listen(80, function() {
  console.log("CORS-enabled web server listening on port 80");
});

module.exports = app;
