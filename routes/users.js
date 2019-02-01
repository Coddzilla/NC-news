const usersRouter = require("express").Router();
const {
  sendUsers,
  postUser,
  getUserByUsername
} = require("../controllers/users");

usersRouter
  .route("/")
  .get(sendUsers)
  .post(postUser);

usersRouter.route("/:username").get(getUserByUsername);

// usersRouter
//   .route("/:topic/articles")
//   .get(sendArticleCount)
//   .post(postArtilceByTopic);

module.exports = usersRouter;
