const express = require("express");
const indexRouter = require("./routes/indexRouter");
const categoryRouter = require("./routes/categoriesRouter");
const locationRouter = require("./routes/locationsRouter");
const inventoryRouter = require("./routes/inventoryRouter");
const suppliersRouter = require("./routes/suppliersRouter");

const path = require("node:path");
const app = express();

require('dotenv').config();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", indexRouter);
app.use("/categories", categoryRouter);
app.use("/locations", locationRouter);
app.use("/inventory", inventoryRouter);
app.use("/suppliers", suppliersRouter);


app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).render("error", { message: "Something went wrong." });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});