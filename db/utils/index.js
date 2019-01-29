const { articleData, userData, commentData } = require("../data/index");

// const  = users.username;
// const articleRef = articles.article_id;

const formattedArticles = articleData => {
  return articleData.map(({ created_by, created_at, ...restOfArticle }) => {
    return {
      username: created_by,
      created_at: new Date(created_at),
      ...restOfArticle
    };
  });
};
// const newComment = comments => {
//   comments.map(comment => {});
// };

// createArticleRefObj = articleData => {
//   let articleRef = {};
//   articleData.forEach(article => (articleRef.title = articleData.article_id));
//   return articleRef;
// };

const articleRef = articleData =>
  articleData.reduce((articleObj, articleCurr) => {
    articleObj[articleCurr.title] = articleCurr.article_id;
    return articleObj;
  }, {});

// artticleRef - make new obj wth -
// {
//title: id
//}

// don't need userRef

const formattedComments = (commentData, articleRef) => {
  const formattedComments = commentData.map(
    ({ created_at, created_by, belongs_to, body, votes }) => ({
      body,
      votes,
      username: created_by,
      created_at: new Date(created_at),
      article_id: articleRef.belongs_to
    })
  );
  return formattedComments;
};
module.exports = { formattedArticles, formattedComments, articleRef };

// {...restOfArticle, user:creaded_by}
