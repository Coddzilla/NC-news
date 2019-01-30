// const getTopics = require("../models/topics");
// const recieveTopics = require("../models/topics");
const {
  getTopics,
  recieveTopics,
  getArticlesWithCommentCount,
  getTotalArticleCount
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
  recieveTopics(postData).then(([topic]) => {
    res.status(201).send({ topic });
  });
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

// (module.exports = sendTopics), postTopics;
module.exports = {
  sendTopics,
  postTopics,
  sendArticleCount
};
//weird
//post
