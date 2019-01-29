const topicsRouter = require("express").Router();
const { sendTopics, postTopics } = require("../controllers/topics");
// const postTopics = require("../controllers/topics");

topicsRouter
  .route("/")
  .get(sendTopics)
  .post(postTopics);

module.exports = topicsRouter;
