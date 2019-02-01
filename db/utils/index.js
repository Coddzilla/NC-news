const { articleData, userData, commentData } = require("../data/index");

const formattedArticles = articleData => {
  return articleData.map(({ created_by, created_at, ...restOfArticle }) => {
    return {
      username: created_by,
      created_at: new Date(created_at),
      ...restOfArticle
    };
  });
};

const articleRef = articleData =>
  articleData.reduce((articleObj, articleCurr) => {
    articleObj[articleCurr.title] = articleCurr.article_id;
    return articleObj;
  }, {});

const formattedComments = (commentData, articleRef) => {
  const formattedComments = commentData.map(
    ({ created_at, created_by, belongs_to, body, votes }) => ({
      body,
      votes,
      username: created_by,
      created_at: new Date(created_at),
      article_id: articleRef[belongs_to]
    })
  );
  return formattedComments;
};

const alteredArticleObject = formattedArticles => {
  const alteredArticlesForCommentCount = formattedArticles.map(
    ({ username, title, article_id, votes, created_at, topic }) => ({
      author: username,
      title,
      article_id,
      votes,
      comment_count: "comment_count",
      created_at,
      topic
    })
  );
  return alteredArticlesForCommentCount;
};
module.exports = {
  formattedArticles,
  formattedComments,
  articleRef,
  alteredArticleObject
};
