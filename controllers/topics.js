// const getTopics = require("../models/topics");
// const recieveTopics = require("../models/topics");
const { getTopics, recieveTopics } = require("../models/topics");

const sendTopics = (req, res, next) => {
  getTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => console.log(err) || next(err));
};

const postTopics = (req, res, next) => {
  const postData = req.body;
  recieveTopics(postData).then(([topic]) => {
    res.status(201).send({ topic });
  });
};

// (module.exports = sendTopics), postTopics;
module.exports = { sendTopics, postTopics };
//weird
//post
