const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const articleRouter = require("./articles");
const usersRouter = require("./users");
const apiObject = require("../homePage");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/users", usersRouter);

apiRouter.use("/", (req, res, next) => {
  console.log(apiObject);
  res.status(200).send(apiObject);
});

module.exports = apiRouter;
