const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const articleRouter = require("./articles");
const usersRouter = require("./users");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/users", usersRouter);

module.exports = apiRouter;
