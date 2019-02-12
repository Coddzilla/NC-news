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
  console.log("req.body", req.body);
  if (!req.body.username || !req.body.name || !req.body.avatar_url) {
    console.log("in the if");
    return next({ status: 400, msg: "bad request" });
  }
  addUser(req.body)
    .then(([user]) => {
      console.log({ user });
      return res.status(201).send({ user });
    })
    .catch(err => console.log(err) || next(err));
};

const getUserByUsername = (req, res, next) => {
  console.log(req.params);
  fetchUserByUsername(req.params)
    .then(([user]) => {
      console.log(user);
      if (!user || user === undefined) {
        return Promise.reject({
          status: 404,
          msg: "that username does not exist"
        });
      }
      return res.status(200).send({ user });
    })
    .catch(err => console.log(err) || next(err));
};

const getArticlesByUsername = (req, res, next) => {
  Promise.all([
    getTotalArticleCount(req.params, req.query),
    fetchArticlesByUsername(req.params, req.query)
  ])
    .then(([total_count, articles]) => {
      console.log(articles);
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
