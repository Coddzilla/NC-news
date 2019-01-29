// const getTopics = require("../models/topics");
// const recieveTopics = require("../models/topics");
const { getTopics, recieveTopics } = require("../models/topics");

sendTopics = (req, res, next) => {
  getTopics()
    .then(topics => {
      res.status(200).send({ topics });
    })
    .catch(err => console.log(err) || next(err));
};

postTopics = (req, res, next) => {
  const postData = req.body;
  recieveTopics(postData).then(topics => {
    res.status(201).send({ topics });
  });
};

// (module.exports = sendTopics), postTopics;
module.exports = { sendTopics, postTopics };
//weird
//post
