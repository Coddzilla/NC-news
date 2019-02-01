const {
  getArticleCount,
  getArticlesWithCommentCount,
  fetchArticleById,
  patchArticles,
  fetchArticleComments,
  updateArticleComments,
  deleteArticle,
  deleteComment
} = require("../models/articles");

const { getTotalArticleCount } = require("../models/topics");

const fetchArticles = (req, res, next) => {
  Promise.all([
    getArticleCount(req.query),
    getArticlesWithCommentCount(req.query)
  ])
    .then(([total_count, articles]) => {
      res.send({ total_count, articles });
    })
    .catch(err => console.log(err) || next(err));
};

const getArticleByArticleId = (req, res, next) => {
  fetchArticleById(req.params)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, message: "element not found" });
      }

      res.status(200).send({ article });
    })
    .catch(err => console.log(err) || next(err));
};

const updateArticles = (req, res, next) => {
  patchArticles(req.params, req.body)
    .then(([article]) => {
      res.status(200).send({ article });
    })
    .catch(err => console.log(err) || next(err));
};

const getArticleCommentsByArticleId = (req, res, next) => {
  fetchArticleComments(req.params, req.query, req.body)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => console.log(err) || next(err));
};

const patchArticleComments = (req, res, next) => {
  updateArticleComments(req.body, req.params)
    .then(([comment]) => {
      return res.status(200).send({ comment });
    })
    .catch(err => console.log(err) || next(err));
};

const deleteArticleByArticleId = (req, res, next) => {
  deleteArticle(req.params)
    .then(() => {
      return res.status(204).send();
    })
    .catch(err => console.log(err) || next(err));
};

const deleteCommentByCommentId = (req, res, next) => {
  deleteComment(req.params)
    .then(() => {
      return res.status(204).send();
    })
    .catch(err => console.log(err) || next(err));
};

module.exports = {
  fetchArticles,
  getArticleByArticleId,
  updateArticles,
  getArticleCommentsByArticleId,
  patchArticleComments,
  deleteArticleByArticleId,
  deleteCommentByCommentId
};
