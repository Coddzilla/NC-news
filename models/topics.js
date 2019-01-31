const connection = require("../db/connection");

const getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

const recieveTopics = postData => {
  return connection
    .insert(postData)
    .into("topics")
    .returning("*");
};

const getArticlesWithCommentCount = ({
  limit = 10,
  sort_by = "created_at",
  order = "desc",
  p = 1
}) => {
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
    .limit(limit)
    .offset((parseInt(p) - 1) * limit)
    .orderBy(sort_by, order)
    .groupBy("articles.article_id");
};

const getTotalArticleCount = () => {
  return connection("articles")
    .count("article_id")
    .then(([{ count }]) => {
      return +count;
      //the + turns the numeric string into a number
    });
};

const recieveArticleByTopic = (postData, topic) => {
  postData.topic = topic.topic;
  console.log(postData);
  return connection
    .insert(postData)
    .into("articles")
    .returning("*");
  // .where("topic", "=", topic);
};
//how to put in data from the req.params and the req.body
module.exports = {
  getTopics,
  recieveTopics,
  getArticlesWithCommentCount,
  getTotalArticleCount,
  recieveArticleByTopic
};
