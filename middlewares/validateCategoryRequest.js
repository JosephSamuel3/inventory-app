const { validationResult } = require("express-validator");
const { createCategoryValidator } = require("../validations/categoryValidators");
const { updateCategoryValidator } = require("../validations/categoryValidators");
const db = require("../db/queries/categoriesQueries");

const validateCategoryCreate = [
    ...createCategoryValidator,
    (req, res, next) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).render("categories/create", {
                title: "Create Category",
                errors: result.array(),
                body: req.body,
            });
        }

        next();
    },
];

const validateCategoryEdit = [
    ...updateCategoryValidator,
    async (req, res, next) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const category = await db.getCategoryById(req.params.id);

            return res.status(400).render("categories/edit", {
                title: "Edit Category",
                errors: result.array(),
                body: req.body,
                category,
            });
        }

        next();
    },
];

module.exports = {
    validateCategoryCreate,
    validateCategoryEdit,
};
