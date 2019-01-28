const {articles} = require('../data/development-data/articles');

articles.map(({created_by, created_at, ...restOfArticle}) => {
  {...restOfArticle, 'username': created_by, 'created_at': new Date(created_at)}
})


// {...restOfArticle, us}