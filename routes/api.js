const apiRouter = require("express").Router();
const topicsRouter = require("./topics");
const articleRouter = require("./articles");

apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);

module.exports = apiRouter;
