const { Router } = require("express");
const { getDashboard } = require("../controllers/indexController");

const indexRouter = Router();

indexRouter.get("/", getDashboard);

module.exports = indexRouter;
