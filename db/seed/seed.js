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
      // console.log(users);
      // console.log("ARTICLE-DATA BEFORE", articleData[0]);
      console.log(typeof formattedArticles, "!!!!!!!!!!!!");
      return connection.insert(formattedArticles(articleData)).into("articles");
    })
    .then(() => {
      console.log("hihi");
      return connection
        .insert(formattedComments(commentData, articleRef))
        .into("comment");
    });
};
