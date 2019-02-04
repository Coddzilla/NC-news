const connection = require("../db/connection");

const getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

const addTopic = postData => {
  return connection
    .insert(postData)
    .into("topics")
    .returning("*");
};

const getArticlesWithCommentCount = (
  { topic },
  { limit = 10, sort_by = "created_at", order = "desc", p = 1 }
) => {
  console.log("in the model");
  return connection
    .select(
      { author: "articles.username" },
      "articles.title",
      "articles.article_id",
      "articles.votes",
      "articles.created_at",
      "articles.topic"
    )
    .count("comment.comment_id as comment_count")
    .from("articles")
    .where("topic", "=", topic)
    .leftJoin("comment", "articles.article_id", "comment.article_id")
    .limit(limit)
    .offset((parseInt(p) - 1) * limit)
    .orderBy(sort_by, order)
    .groupBy("articles.article_id");
};

//is this not giving me the article count for mitch?
const getTotalArticleCount = ({ topic }, {}) => {
  console.log("topic in model", topic);
  return connection("articles")
    .count("article_id")
    .where("topic", "=", topic)
    .then(([{ count }]) => {
      return +count;
    });
};

const recieveArticleByTopic = (postData, topic) => {
  postData.topic = topic.topic;
  return connection
    .insert(postData)
    .into("articles")
    .returning("*");
  // .where("topic", "=", topic);
};

module.exports = {
  getTopics,
  addTopic,
  getArticlesWithCommentCount,
  getTotalArticleCount,
  recieveArticleByTopic
};
