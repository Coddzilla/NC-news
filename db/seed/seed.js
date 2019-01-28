const {
  articleData,
  topicData,
  userData,
  commentData
} = require("../data/development-data/index");

exports.seed = (connection, Promise) => {
return connection.insert(topicData).into('topics')
.then(() => {
  return connection.insert(userData).into('users')})
.then(() => {
    return connection.insert(articleData).into('articles')})
.then(()=> {
    return connection.insert(commentData).into('comments')
})
};
