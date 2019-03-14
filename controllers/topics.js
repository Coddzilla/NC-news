const {
  getTopics,
  addTopic,
  getArticlesWithCommentCount,
  getTotalArticleCount,
  recieveArticleByTopic
} = require("../models/topics");

const sendTopics = (req, res, next) => {
  getTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => next(err));
};

const postTopics = (req, res, next) => {
  const topic = req.body;
  console.log(topic);
  addTopic(topic)
    .then(([topic]) => {
      console.log("topic", topic);
      if (!topic.slug || !topic.description) {
        return Promise.reject({
          status: 400,
          msg: "there are missing arguments"
        });
      }

      res.status(201).send(topic);
    })
    .catch(err => console.log(err) || next(err));
};
///
const sendArticleCount = (req, res, next) => {
  Promise.all([
    getTotalArticleCount(req.params, req.query),
    getArticlesWithCommentCount(req.params, req.query)
  ])
    .then(([total_count, articles]) => {
      let regex = /^[0-9]+$/;
      let wordRegex = /^[A-Za-z]+$/;

      if (!articles) {
        return Promise.reject({
          status: 404,
          message: "sorry that was not found!"
        });
      } else if (
        (req.query.limit && !regex.test(req.query.limit)) ||
        (req.query.p && !regex.test(req.query.p))
      ) {
        return Promise.reject({
          status: 400,
          msg: "sorry, that was a bad request"
        });
      }
      res.send({ total_count, articles });
    })
    .catch(err => next(err));
};
const postArtilceByTopic = (req, res, next) => {
  const article = req.body;
  const topic = req.params;
  recieveArticleByTopic(article, topic)
    .then(([article]) => {
      res.status(201).send(article);
    })
    .catch(err => next(err));
};

module.exports = {
  sendTopics,
  postTopics,
  sendArticleCount,
  postArtilceByTopic
};
