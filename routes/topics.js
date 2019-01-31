const topicsRouter = require("express").Router();
const {
  sendTopics,
  postTopics,
  sendArticleCount,
  postArtilceByTopic
} = require("../controllers/topics");

topicsRouter
  .route("/")
  .get(sendTopics)
  .post(postTopics);

topicsRouter
  .route("/:topic/articles")
  .get(sendArticleCount)
  .post(postArtilceByTopic);

module.exports = topicsRouter;
