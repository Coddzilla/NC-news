const connection = require("../db/connection");

const getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

const recieveTopics = postData => {
  return connection
    .insert(postData)
    .into("topics")
    .returning("*");
};

module.exports = { getTopics, recieveTopics };
// (module.exports = getTopics), recieveTopics;
