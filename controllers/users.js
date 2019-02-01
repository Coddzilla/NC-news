const {
  getUsers,
  addUser,
  fetchUserByUsername,
  fetchArticlesByUsername,
  getTotalArticleCount
} = require("../models/users");

const sendUsers = (req, res, next) => {
  getUsers()
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(err => console.log(err) || next(err));
};

const postUser = (req, res, next) => {
  addUser(req.body)
    .then(([user]) => res.status(201).send({ user }))
    .catch(err => console.log(err) || next(err));
};

const getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then(([user]) => {
      return res.status(200).send({ user });
    })
    .catch(err => console.log(err) || next(err));
};

// GET /api/users/:username/articles
const getArticlesByUsername = (req, res, next) => {
  Promise.all([
    getTotalArticleCount(req.params, req.query),
    fetchArticlesByUsername(req.params, req.query)
  ])
    //haven't written getArticleCount
    .then(([total_count, articles]) => {
      if (articles.length === 0) {
        return Promise.reject({
          status: 404,
          message: "That is not a valid username"
        });
      }
      res.status(200).send({ total_count, articles });
    })
    .catch(err => console.log(err) || next(err));
};
module.exports = {
  sendUsers,
  postUser,
  getUserByUsername,
  getArticlesByUsername
};
