const { getUsers, addUser, fetchUserByUsername } = require("../models/users");

const sendUsers = (req, res, next) => {
  console.log("req.params", req.params);
  getUsers()
    .then(users => {
      console.log("users", users);
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
  console.log("req.body", req.params);
  console.log("got to controller");

  fetchUserByUsername(req.params)
    .then(([user]) => {
      console.log("got to then block");
      console.log({ user });
      return res.status(200).send({ user });
    })
    .catch(err => console.log(err) || next(err));
};

module.exports = { sendUsers, postUser, getUserByUsername };
