const apiObject = {
  "/api/topics": "Dislpays all news topics",
  "/api/topics/:topic/articles":
    "displays all news articles for a specific topic",
  "/api/articles": "displays all news articles",
  "/api/articles/:article_id":
    "displays news articles when a specific article id",
  "/api/articles/:article_id/comments":
    "displays all comments for an article with a specific article id",
  "/api/articles/:article_id/comments/:comment_id":
    "displays all comments with a specific comment id for an article with a specific article id",
  "/api/users": "displays all users",
  "/api/users/:username": "displays users with a specific username",
  "/api/users/:username/articles":
    "displays all articles with a specific username"
};

module.exports = { apiObject };
