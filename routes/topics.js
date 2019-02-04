const topicsRouter = require("express").Router();
const {
  sendTopics,
  postTopics,
  sendArticleCount,
  postArtilceByTopic
} = require("../controllers/topics");
const { handle405 } = require("../errorHandling");

topicsRouter
  .route("/")
  .get(sendTopics)
  .post(postTopics)
  .all(handle405);

topicsRouter
  .route("/:topic/articles")
  .get(sendArticleCount)
  .post(postArtilceByTopic)
  .all(handle405);

module.exports = topicsRouter;
