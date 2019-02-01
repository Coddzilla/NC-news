const connection = require("../db/connection");

const getUsers = () => {
  return connection.select("*").from("users");
};

const addUser = postData => {
  return connection
    .insert(postData)
    .into("users")
    .returning("*");
};

const fetchUserByUsername = ({ username }) => {
  console.log("got to model");
  console.log(username);
  return connection
    .select("*")
    .from("users")
    .where("username", "=", username);
};

module.exports = { getUsers, addUser, fetchUserByUsername };
