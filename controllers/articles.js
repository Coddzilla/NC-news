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
  console.log(req.query, req.params);
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
      // [total_count, articles] = ;
      console.log({ total_count, articles });
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
  console.log(req.params, req.body, req.query);
  patchArticles(req.params, req.body)
    .then(([article]) => {
      let numRegex = /^-?[0-9]+$/;
      if (req.body.inc_votes && !numRegex.test(req.body.inc_votes)) {
        res.status(400).send({ msg: "sorry that is a bad request" });
      }
      res.status(200).send({ article });
    })
    .catch(err => console.log(err) || next(err));
};

const getArticleCommentsByArticleId = (req, res, next) => {
  console.log(req.params, req.query, req.body);
  fetchArticleComments(req.params, req.query, req.body)
    .then(comments => {
      console.log({ comments });
      if (!comments || comments.length === 0) {
        console.log("yoooo");
        return Promise.reject({ status: 400, msg: "bad request" });
      }
      res.status(200).send({ comments });
    })
    .catch(err => console.log("ERROR", err) || next(err));
};

const patchArticleComments = (req, res, next) => {
  console.log(req.body);
  console.log(req.params);
  if (!req.body || !req.body.inc_votes) {
    return res.status(200).send({ msg: "unmodified" });
  } else {
    updateArticleComments(req.body, req.params)
      .then(([comment]) => {
        if (!comment || comment === undefined) {
          return Promise.reject({
            status: 400,
            msg: "sorrym that id cannot be found"
          });
        }
        console.log(comment);
        return res.status(200).send({ comment });
      })
      .catch(err => console.log(err) || next(err));
  }
};

const deleteArticleByArticleId = (req, res, next) => {
  console.log(req.params);
  deleteArticle(req.params)
    .then(deleted => {
      console.log("mysteet", deleted);
      let numRegex = /^[0-9]+$/;
      if (!req.params.article_id || !numRegex.test(req.params.article_id)) {
        res.status(400).send({ msg: "sorry that was in invalid request" });
      } else if (!deleted || deleted.length === 0) {
        return Promise.reject({ status: 404, msg: "That was not found" });
      }
      return res.status(204).send();
    })
    .catch(err => console.log(err) || next(err));
};

const deleteCommentByCommentId = (req, res, next) => {
  console.log(req.params);
  deleteComment(req.params)
    .then(body => {
      console.log(body);
      if (!body || body.length === 0) {
        return Promise.reject({ status: 400, msg: "bad request" });
      }
      return res.status(204).send();
    })
    .catch(err => console.log(err) || next(err));
};

// const sendComments = (req, res, next) => {
//   console.log("req.params/body", req.params, req.body);
//   postComment(req.params, req.body)
//     .then(comment => {
//       console.log({ comment });
//       return res.status(200).send({ comment });
//     })
//     .catch(err => console.log(err) || next(err));
// };

module.exports = {
  fetchArticles,
  getArticleByArticleId,
  updateArticles,
  getArticleCommentsByArticleId,
  patchArticleComments,
  deleteArticleByArticleId,
  deleteCommentByCommentId
};
