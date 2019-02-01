const usersRouter = require("express").Router();
const {
  sendUsers,
  postUser,
  getUserByUsername,
  getArticlesByUsername
} = require("../controllers/users");

usersRouter
  .route("/")
  .get(sendUsers)
  .post(postUser);

usersRouter.route("/:username").get(getUserByUsername);

usersRouter.route("/:username/articles").get(getArticlesByUsername);

// usersRouter
//   .route("/:topic/articles")
//   .get(sendArticleCount)
//   .post(postArtilceByTopic);

module.exports = usersRouter;
