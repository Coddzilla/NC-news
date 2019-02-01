const connection = require("../db/connection");

const getUsers = () => {
  return connection.select("*").from("users");
};

const addUser = postData => {
  return connection
    .insert(postData)
    .into("users")
    .returning("*");
};

const fetchUserByUsername = ({ username }) => {
  console.log("got to model");
  console.log(username);
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username);
};

const getTotalArticleCount = ({ username }, { limit = 10 }) => {
  console.log(username, "<--- req.params in model for get");
  return connection("articles")
    .count("article_id")
    .where("username", "=", username)
    .then(([{ count }]) => {
      return +count;
    });
};

// username as author
// title
// article_id
// votes
// comment_count - how?
//   created_at
// topic
const fetchArticlesByUsername = (
  { username },
  { limit = 10, sort_by = "created_at", order = "desc", p = 1 }
) => {
  console.log(username, "<--- req.params in model for fetch");
  return connection
    .select(
      { author: "articles.username" },
      "articles.title",
      "articles.article_id",
      "articles.votes",
      "articles.created_at",
      "articles.topic"
    )
    .count("comment.comment_id")
    .as("comment_count")
    .from("articles")
    .leftJoin("comment", "articles.article_id", "comment.article_id")
    .where("articles.username", "=", username)
    .limit(limit)
    .offset((parseInt(p) - 1) * limit)
    .orderBy(sort_by, order)
    .groupBy("articles.article_id");
};

module.exports = {
  getUsers,
  addUser,
  fetchUserByUsername,
  fetchArticlesByUsername,
  getTotalArticleCount
};
