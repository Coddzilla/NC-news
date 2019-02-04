const articleRouter = require("express").Router();
const {
  fetchArticles,
  getArticleByArticleId,
  updateArticles,
  getArticleCommentsByArticleId,
  patchArticleComments,
  deleteArticleByArticleId,
  deleteCommentByCommentId,
  sendComments
} = require("../controllers/articles");

const { handle405 } = require("../errorHandling");

articleRouter
  .route("/")
  .get(fetchArticles)
  .all(handle405);

articleRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(updateArticles)
  .delete(deleteArticleByArticleId)
  .all(handle405);

articleRouter
  .route("/:article_id/comments")
  .get(getArticleCommentsByArticleId)
  // .post(sendComments) //put here?
  .all(handle405);

articleRouter
  .route("/:article_id/comments/:comment_id")
  .patch(patchArticleComments)
  .delete(deleteCommentByCommentId)
  .all(handle405);

module.exports = articleRouter;
