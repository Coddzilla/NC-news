const usersRouter = require("express").Router();
const {
  sendUsers,
  postUser,
  getUserByUsername,
  getArticlesByUsername
} = require("../controllers/users");
const { handle405 } = require("../errorHandling");

usersRouter
  .route("/")
  .get(sendUsers)
  .post(postUser)
  .all(handle405);

usersRouter
  .route("/:username")
  .get(getUserByUsername)
  .all(handle405);

usersRouter
  .route("/:username/articles")
  .get(getArticlesByUsername)
  .all(handle405);

module.exports = usersRouter;
