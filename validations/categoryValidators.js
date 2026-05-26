const { body, param } = require('express-validator');
const { categoryNameExists } = require('../db/queries/categoriesQueries');


// Validates and sanitizes the name field
const nameField = body('name')
  .trim()
  .notEmpty().withMessage('Category name is required.')
  .isLength({ max: 100 }).withMessage('Category name must be 100 characters or fewer.');

// Validates the id route param is a positive integer
const idParam = param('id')
  .isInt({ min: 1 }).withMessage('Category ID must be a positive integer.');


// POST /categories — create
const createCategoryValidator = [
  nameField.custom(async (name) => {
    const exists = await categoryNameExists(name);
    if (exists) throw new Error(`A category named "${name}" already exists.`);
  }),
];


// PUT /categories/:id — update
const updateCategoryValidator = [
  idParam,
  nameField.custom(async (name, { req }) => {
    const exists = await categoryNameExists(name, Number(req.params.id));
    if (exists) throw new Error(`A category named "${name}" already exists.`);
  }),
];


// DELETE /categories/:id  |  GET /categories/:id
const categoryIdValidator = [idParam];

module.exports = {
  createCategoryValidator,
  updateCategoryValidator,
  categoryIdValidator,
};