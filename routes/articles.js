const articleRouter = require("express").Router();
const {
  fetchArticles,
  getArticleByArticleId,
  updateArticles,
  getArticleCommentsByArticleId,
  patchArticleComments,
  deleteArticleByArticleId,
  deleteCommentByCommentId
} = require("../controllers/articles");

articleRouter.route("/").get(fetchArticles);

articleRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(updateArticles)
  .delete(deleteArticleByArticleId);

articleRouter.route("/:article_id/comments").get(getArticleCommentsByArticleId);

articleRouter
  .route("/:article_id/comments/:comment_id")
  .patch(patchArticleComments)
  .delete(deleteCommentByCommentId);

module.exports = articleRouter;
