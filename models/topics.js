const connection = require("../db/connection");

getTopics = () => {
  return connection
    .select("*")
    .from("topics")
    .returning("*");
};

recieveTopics = postData => {
  return connection
    .insert(postData)
    .into("topics")
    .returning("*");
};

module.exports = { getTopics, recieveTopics };
// (module.exports = getTopics), recieveTopics;
