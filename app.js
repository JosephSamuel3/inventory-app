const express = require("express");
const categoryRouter = require("./routes/categoriesRouter");
const locationRouter = require("./routes/locationsRouter");

const path = require("node:path");
const app = express();

require('dotenv').config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/category", categoryRouter);
app.use("/location", locationRouter);


app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).send(err.message);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});