const {
  getTopics,
  recieveTopics,
  getArticlesWithCommentCount,
  getTotalArticleCount,
  recieveArticleByTopic
} = require("../models/topics");

const sendTopics = (req, res, next) => {
  getTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => console.log(err) || next(err));
};

const postTopics = (req, res, next) => {
  const postData = req.body;
  recieveTopics(postData)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(err => console.log(err) || next(err));
};

// const sendArticleByTopic = (req, res, next) => {
//   const topicToFindArticle = req.params;
//   console.log(req.params);
//   getTopicByArticle().then(() => {});
// };

const sendArticleCount = (req, res, next) => {
  console.log(req.query);
  Promise.all([
    getTotalArticleCount(req.query),
    getArticlesWithCommentCount(req.query)
  ])
    .then(([total_count, articles]) => {
      console.log([total_count, articles]);
      res.send({ total_count, articles });
    })
    .catch(err => console.log(err) || next(err));
  // getArticlesWithCommentCount()
  //   .then(getTotalArticleCount())
  //   .then(articleCount => {
  //     res.status(200).send({ articleCount });
  //   });
};

const postArtilceByTopic = (req, res, next) => {
  const postData = req.body;
  const topic = req.params;
  recieveArticleByTopic(postData, topic)
    .then(([article]) => {
      console.log("POST ARTICLE", article);
      res.status(201).send(article);
    })
    .catch(err => console.log(err) || next(err));
};

// (module.exports = sendTopics), postTopics;
module.exports = {
  sendTopics,
  postTopics,
  sendArticleCount,
  postArtilceByTopic
};
