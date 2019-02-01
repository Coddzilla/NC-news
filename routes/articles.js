const articleRouter = require("express").Router();
const {
  fetchArticles,
  getArticleByArticleId,
  updateArticles,
  getArticleCommentsByArticleId,
  patchArticleComments
} = require("../controllers/articles");

articleRouter.route("/").get(fetchArticles);

articleRouter
  .route("/:article_id")
  .get(getArticleByArticleId)
  .patch(updateArticles);
//.delete(deleteArticleById)

articleRouter.route("/:article_id/comments").get(getArticleCommentsByArticleId);

articleRouter
  .route("/api/articles/:article_id/comments/:comment_id")
  .patch(patchArticleComments);

module.exports = articleRouter;
