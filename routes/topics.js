const topicsRouter = require("express").Router();
const {
  sendTopics,
  postTopics,
  sendArticleCount
} = require("../controllers/topics");

topicsRouter
  .route("/")
  .get(sendTopics)
  .post(postTopics);

topicsRouter.route("/:topic/articles").get(sendArticleCount);

module.exports = topicsRouter;
