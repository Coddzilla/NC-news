const topicsRouter = require("express").Router();
const {
  sendTopics,
  postTopics,
  sendArticleByTopic
} = require("../controllers/topics");
// const postTopics = require("../controllers/topics");

topicsRouter
  .route("/")
  .get(sendTopics)
  .post(postTopics);

topicsRouter.route("/:topic/articles").get(sendArticleByTopic);

// /api/topics /: topic / articles

module.exports = topicsRouter;
