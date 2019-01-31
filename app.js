const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api");
const { handle400, handle500, handle404 } = require("./errorHandling");

app.use(bodyParser.json());
app.use("/api", apiRouter);

app.use(handle400);
app.use(handle404);
app.use(handle500);

module.exports = app;
