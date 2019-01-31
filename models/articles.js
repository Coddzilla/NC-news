const connection = require("../db/connection");

const getArticleCount = () => {
  return connection("articles")
    .count("article_id")
    .then(([{ count }]) => {
      return +count;
      //the + turns the numeric string into a number
    });
};
//how to change the count so that it responds to the getArticlesWithCommentCount limit
const getArticlesWithCommentCount = ({
  limit = 10,
  sort_by = "created_at",
  order = "desc",
  p = 1
}) => {
  console.log(limit);
  return connection
    .select(
      { author: "articles.username" },
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.votes",
      "articles.created_at",
      "articles.topic"
    )
    .count("comment.comment_id")
    .as("comment_count")
    .from("articles")
    .leftJoin("comment", "articles.article_id", "comment.article_id")
    .limit(limit)
    .offset((parseInt(p) - 1) * limit)
    .orderBy(sort_by, order)
    .groupBy("articles.article_id");
};

const fetchArticleById = ({ article_id }) => {
  return connection
    .select(
      { author: "articles.username" },
      "articles.title",
      "articles.article_id",
      "articles.body",
      "articles.votes",
      "articles.created_at",
      "articles.topic"
    )
    .count("comment.comment_id")
    .as("comment_count")
    .from("articles")
    .leftJoin("comment", "articles.article_id", "comment.article_id")
    .where("articles.article_id", "=", parseInt(article_id))

    .groupBy("articles.article_id");
};

module.exports = {
  getArticleCount,
  getArticlesWithCommentCount,
  fetchArticleById
};
