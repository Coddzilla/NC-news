const connection = require("../db/connection");

const getArticleCount = () => {
  return connection("articles")
    .count("article_id")
    .then(([{ comment_count }]) => {
      return +comment_count;
    });
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
      "articles.body",
      "articles.votes",
      "articles.created_at",
      "articles.topic"
    )
    .count("comment.comment_id as comment_count")
    .from("articles")
    .leftJoin("comment", "articles.article_id", "comment.article_id")
    .limit(limit)
    .offset((parseInt(p) - 1) * limit)
    .orderBy(sort_by, order)
    .groupBy("articles.article_id");
};

const fetchArticleById = ({ article_id }) => {
  return (
    connection
      .select(
        { author: "articles.username" },
        "articles.title",
        "articles.article_id",
        "articles.body",
        "articles.votes",
        "articles.created_at",
        "articles.topic"
      )
      .count("comment.comment_id as comment_count")
      .from("articles")
      .leftJoin("comment", "articles.article_id", "comment.article_id")
      .where("articles.article_id", "=", parseInt(article_id))
      // ..increment("votes", patchData)
      .groupBy("articles.article_id")
  );
};

// const patchArticles = (article_id, patchData) => {
//   return connection("articles")
//     .where("article_id", "=", parseInt(article_id.article_id))
//     .count("comment.comment_id")
//     .as("count")
//     .from("articles")
//     .leftJoin("comment", "articles.article_id", "comment.article_id")
//     .groupBy("articles.article_id")
//     .increment("votes", 2)
//     .returning("*");
// };

const patchArticles = ({ article_id }, { inc_votes }) => {
  return connection("articles")
    .where("articles.article_id", "=", parseInt(article_id))
    .increment("votes", inc_votes)
    .returning("*");
};
//don't think this is working for p
const fetchArticleComments = (
  { article_id },
  { limit = 10, sort_by = "created_at", order = "desc", p = 1 }
) => {
  console.log("fetch11");
  return (
    connection
      .select(
        "comment.comment_id",
        "comment.votes",
        "comment.created_at",
        { author: "comment.username" },
        "comment.body"
      )
      .from("comment")
      .where("comment.article_id", "=", parseInt(article_id))
      // .increment("votes", inc_votes)
      .limit(parseInt(limit))
      .offset((parseInt(p) - 1) * limit)
      .orderBy(sort_by, order)
  );
};

const updateArticleComments = ({ inc_votes }, { article_id, comment_id }) => {
  return connection("comment")
    .increment("votes", inc_votes)
    .where("comment.comment_id", "=", parseInt(comment_id))
    .returning("*");
};

const deleteArticle = ({ article_id }) => {
  return connection("articles")
    .delete("*")
    .where("article_id", "=", article_id);
};

const deleteComment = ({ article_id, comment_id }) => {
  return connection("comment")
    .delete("*")
    .where("comment_id", "=", comment_id);
};

// const postComment = ({ article_id }) => {
//   return connection
//     .insert(comment)
//     .into("articles")
//     .where("article_id", "=", article_id)
//     .returning("*");
// };

const addTopic = postData => {
  return connection
    .insert(postData)
    .into("topics")
    .returning("*");
};

module.exports = {
  getArticleCount,
  getArticlesWithCommentCount,
  fetchArticleById,
  patchArticles,
  fetchArticleComments,
  updateArticleComments,
  deleteArticle,
  deleteComment
};
