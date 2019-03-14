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
    .catch(err => next(err));
};

const postUser = (req, res, next) => {
  if (
    !req.body.user.username ||
    !req.body.user.name ||
    !req.body.user.avatar_url ||
    req.body.length === 0
  ) {
    return next({ status: 400, msg: "bad request" });
  }

  addUser(req.body)
    .then(([user]) => {
      return res.status(201).send({ user });
    })
    .catch(err => next(err));
};

const getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then(([user]) => {
      if (!user || user === undefined) {
        return Promise.reject({
          status: 404,
          msg: "that username does not exist"
        });
      }
      return res.status(200).send({ user });
    })
    .catch(err => next(err));
};

const getArticlesByUsername = (req, res, next) => {
  Promise.all([
    getTotalArticleCount(req.params, req.query),
    //getUserByUsername and if this is empty check other stuff
    fetchArticlesByUsername(req.params, req.query)
  ])
    .then(([total_count, articles]) => {
      //how to test if the username is not valid when it's just an empty array.
      if (!articles) {
        return Promise.reject({
          status: 404,
          message: "That is not a valid username"
        });
      }
      res.status(200).send({ total_count, articles });
    })
    .catch(err => next(err));
};
module.exports = {
  sendUsers,
  postUser,
  getUserByUsername,
  getArticlesByUsername
};
