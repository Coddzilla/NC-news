const articleRouter = require("express").Router();
const {
  fetchArticles,
  // postArticle,
  // sendComments,
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
  // .post(postArticle)
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
  // .post(sendComments)
  .all(handle405);

articleRouter
  .route("/:article_id/comments/:comment_id")
  .patch(patchArticleComments)
  .delete(deleteCommentByCommentId)
  .all(handle405);

module.exports = articleRouter;
