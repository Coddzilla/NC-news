const {
  articleData,
  topicData,
  userData,
  commentData
} = require("../data/index");
const {
  formattedArticles,
  formattedComments,
  articleRef
} = require("../utils/index");
// const  = require("../utils/index");
// const  = require("../utils/index");

exports.seed = (connection, Promise) => {
  return connection
    .insert(topicData)
    .into("topics")
    .then(() => {
      return connection
        .insert(userData)
        .into("users")
        .returning("*");
    })
    .then(users => {
      return connection
        .insert(formattedArticles(articleData))
        .into("articles")
        .returning("*");
    })
    .then(articlesInDB => {
      return connection
        .insert(formattedComments(commentData, articleRef(articlesInDB)))
        .into("comment");
    });
};
