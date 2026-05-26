const { body, param } = require('express-validator');
const { supplierNameExists } = require('../db/queries/suppliersQueries');


const idParam = param('id')
  .isInt({ min: 1 }).withMessage('Supplier ID must be a positive integer.');

const nameField = body('name')
  .trim()
  .notEmpty().withMessage('Supplier name is required.')
  .isLength({ max: 255 }).withMessage('Supplier name must be 255 characters or fewer.');

const emailField = body('email')
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isEmail().withMessage('A valid email address is required.')
  .isLength({ max: 255 }).withMessage('Email must be 255 characters or fewer.')
  .normalizeEmail();

const phoneField = body('phone')
  .optional({ nullable: true, checkFalsy: true })
  .trim()
  .isLength({ max: 50 }).withMessage('Phone number must be 50 characters or fewer.');


// POST /suppliers — create
const createSupplierValidator = [
  nameField.custom(async (name) => {
    const exists = await supplierNameExists(name);
    if (exists) throw new Error(`A supplier named "${name}" already exists.`);
  }),
  emailField,
  phoneField,
];


// PUT /suppliers/:id — update
const updateSupplierValidator = [
  idParam,
  nameField.custom(async (name, { req }) => {
    const exists = await supplierNameExists(name, Number(req.params.id));
    if (exists) throw new Error(`A supplier named "${name}" already exists.`);
  }),
  emailField,
  phoneField,
];


// DELETE /suppliers/:id  |  GET /suppliers/:id
const supplierIdValidator = [idParam];

module.exports = {
  createSupplierValidator,
  updateSupplierValidator,
  supplierIdValidator,
};