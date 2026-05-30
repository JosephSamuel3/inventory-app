const { body, param, query } = require('express-validator');
const { supplierNameExists } = require('../db/queries/suppliersQueries');


const idParam = param('id')
  .isInt({ min: 1 }).withMessage('Supplier ID must be a positive integer.');

// Factory — returns a fresh chain each call so .custom() calls don't bleed between validators
const nameField = () =>
  body('name')
    .trim()
    .notEmpty().withMessage('Supplier name is required.')
    .isLength({ max: 255 }).withMessage('Supplier name must be 255 characters or fewer.');

const emailField = body('email')
  .trim()
  .notEmpty().withMessage('Email is required.')
  .isEmail().withMessage('A valid email address is required.')
  .isLength({ max: 255 }).withMessage('Email must be 255 characters or fewer.')
  .normalizeEmail();

const phoneField = body('phone')
  .trim()
  .notEmpty().withMessage('Phone number is required.')
  .isLength({ max: 50 }).withMessage('Phone number must be 50 characters or fewer.');


// POST /suppliers — create
const createSupplierValidator = [
  nameField().custom(async (name) => {
    const exists = await supplierNameExists(name);
    if (exists) throw new Error(`A supplier named "${name}" already exists.`);
  }),
  emailField,
  phoneField,
];


// PUT /suppliers/:id — update
const updateSupplierValidator = [
  idParam,
  nameField().custom(async (name, { req }) => {
    const exists = await supplierNameExists(name, Number(req.params.id));
    if (exists) throw new Error(`A supplier named "${name}" already exists.`);
  }),
  emailField,
  phoneField,
];

const searchSupplierValidator = [
  query('search')
    .trim()
    .notEmpty().withMessage('Search term is required.')
    .isLength({ max: 255 }).withMessage('Search term must be 255 characters or fewer.'),
];

// DELETE /suppliers/:id  |  GET /suppliers/:id
const supplierIdValidator = [idParam];

module.exports = {
  createSupplierValidator,
  updateSupplierValidator,
  searchSupplierValidator,
  supplierIdValidator,
};