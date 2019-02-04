const handle400 = (err, req, res, next) => {
  const codes = {
    "23503": "username not found",
    "42703": "That sort order cannot be implimented",
    "23502": "null value in column violates not- null constraint",
    "22P02": 'invalid input syntax for integer: "NaN"'
  };
  if (codes[err.code] || err.status === 400) {
    res.status(400).send({ msg: "sorry there was a 400, bad request!" });
  } else {
    next(err);
  }
};

const handle404 = (err, req, res, next) => {
  if (err.status === 404 || codes[err.code]) {
    console.log("in the 404 error");
    res.status(404).send({ msg: "sorry, that was not found" });
  } else {
    next(err);
  }
};
const handle405 = (req, res, next) => {
  console.log("in the 405");
  res
    .status(405)
    .send({ msg: "sorry, that request is not supported at this end point" });
};
const handle422 = (err, req, res, next) => {
  console.log("in the 405");
  const codes = {
    "23505": 'duplicate key value violates unique constraint "topics_pkey"'
  };
  if (err.status === 422 || codes[err.code]) {
    res.status(422).send({
      msg: 'duplicate key value violates unique constraint "topics_pkey"'
    });
  } else {
    next(err);
  }
};
const handle500 = (err, req, res, next) => {
  res
    .status(500)
    .send({ msg: "there was a 500 or another error yet to be accounted for" });
};

module.exports = { handle400, handle500, handle404, handle422, handle405 };
