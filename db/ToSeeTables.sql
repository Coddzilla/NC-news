\c nc_news_test;

SELECT articles.username AS author, articles.title, articles.article_id, articles.votes, articles.created_at, articles.topic, COUNT(comment.comment_id) AS comment_count FROM articles 
LEFT JOIN comment
ON articles.article_id = comment.article_id
GROUP BY articles.article_id;

SELECT COUNT(articles.article_id)
  FROM articles
  WHERE topic = 'mitch';

-- select * frpm articles and join in the comments from the comment table and group by the comments.article_id

-- , COUNT(articles.topic)

-- SELECT  articles.title, articles.article_id, comment.article_id,comment.comment_id ,articles.votes, articles.created_at, articles.topic FROM articles 
-- LEFT JOIN comment
-- ON articles.article_id = comment.article_id;

