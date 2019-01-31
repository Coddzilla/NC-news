const handle400 = (err, req, res, next) => {
  const codes = {
    "23503": "username not found",
    "23505": "this key already exists, use a unique key",
    "42703": "That sort order cannot be implimented"
  };
  if (codes[err.code]) {
    res.status(400).send({ msg: codes[err.code] });
  } else {
    next(err);
  }
};

const handle404 = (err, req, res, next) => {
  if ((err.status = 404)) {
    res.status(404).send({ msg: "sorry, that was not found" });
  }
};
const handle500 = (err, req, res, next) => {
  res
    .status(500)
    .send({ msg: "there was a 500 or another error yet to be accounted for" });
};

module.exports = { handle400, handle500, handle404 };
