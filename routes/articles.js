const articleRouter = require("express").Router();
const {
  fetchArticles,
  getArticleByArticleId
} = require("../controllers/articles");

articleRouter.route("/").get(fetchArticles);
// .post();

articleRouter.route("/:article_id").get(getArticleByArticleId);

module.exports = articleRouter;
