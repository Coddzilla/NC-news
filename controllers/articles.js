const {
  getArticleCount,
  getArticlesWithCommentCount,
  fetchArticleById,
  patchArticles,
  fetchArticleComments,
  updateArticleComments,
  deleteArticle,
  deleteComment,
  postComment
} = require("../models/articles");

const { getTotalArticleCount } = require("../models/topics");

const fetchArticles = (req, res, next) => {
  Promise.all([
    getArticleCount(req.query),
    getArticlesWithCommentCount(req.query)
  ])
    .then(([total_count, articles]) => {
      let regex = /^[0-9]+$/;
      let wordRegex = /^[A-Za-z]+$/;
      if (req.query.limit && !regex.test(req.query.limit)) {
        return Promise.reject({
          status: 400,
          msg: "sorry, that was a bad request"
        });
      }

      res.send({ total_count, articles });
    })
    .catch(err => next(err));
};

const getArticleByArticleId = (req, res, next) => {
  fetchArticleById(req.params)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, message: "element not found" });
      }

      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

const updateArticles = (req, res, next) => {
  patchArticles(req.params, req.body)
    .then(([article]) => {
      let numRegex = /^-?[0-9]+$/;
      if (req.body.inc_votes && !numRegex.test(req.body.inc_votes)) {
        res.status(400).send({ msg: "sorry that is a bad request" });
      }
      res.status(200).send({ article });
    })
    .catch(err => next(err));
};

const getArticleCommentsByArticleId = (req, res, next) => {
  fetchArticleComments(req.params, req.query, req.body)
    .then(comments => {
      console.log({ comments });
      if (!comments || comments.length === 0) {
        return Promise.reject({ status: 400, msg: "bad request" });
      }
      res.status(200).send({ comments });
    })
    .catch(err => next(err));
};

const patchArticleComments = (req, res, next) => {
  if (!req.body || !req.body.inc_votes) {
    return res.status(200).send({ msg: "unmodified" });
  } else {
    updateArticleComments(req.body, req.params)
      .then(([comment]) => {
        if (comment === undefined) {
          return Promise.reject({
            status: 400,
            msg: "sorry that id cannot be found"
          });
        }

        return res.status(200).send({ comment });
      })
      .catch(err => next(err));
  }
};

const deleteArticleByArticleId = (req, res, next) => {
  deleteArticle(req.params)
    .then(deleted => {
      console.log(deleted);
      let numRegex = /^[0-9]+$/;
      if (!req.params.article_id || !numRegex.test(req.params.article_id)) {
        console.log("in here");
        res.status(400).send({ msg: "sorry that was in invalid request" });
      } else if (!deleted || deleted.length === 0) {
        return Promise.reject({ status: 404, msg: "That was not found" });
      } else {
        return res.status(204).send({});
      }
    })
    .catch(err => {
      console.log(err);
      next(err);
    });
};

const deleteCommentByCommentId = (req, res, next) => {
  deleteComment(req.params)
    .then(body => {
      if (!body || body.length === 0) {
        return Promise.reject({ status: 400, msg: "bad request" });
      }
      return res.status(204).send();
    })
    .catch(err => next(err));
};

const sendComments = (req, res, next) => {
  const { article_id } = req.params;
  console.log(article_id);
  const comment = req.body;
  postComment(article_id, comment)
    .then(comment => {
      console.log({ comment });
      return res.status(201).send({ comment });
    })
    .catch(err => console.log(err) || next(err));
};

module.exports = {
  fetchArticles,
  sendComments,
  getArticleByArticleId,
  updateArticles,
  getArticleCommentsByArticleId,
  patchArticleComments,
  deleteArticleByArticleId,
  deleteCommentByCommentId
};
