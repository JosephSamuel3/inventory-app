const { body, param, query } = require('express-validator');
const { skuExists } = require('../db/queries/inventoryQueries');


// Reusable field rules
const idParam = param('id')
  .isInt({ min: 1 }).withMessage('Item ID must be a positive integer.');

const nameField = body('name')
  .trim()
  .notEmpty().withMessage('Item name is required.')
  .isLength({ max: 255 }).withMessage('Item name must be 255 characters or fewer.');

const descriptionField = body('description')
  .trim()
  .notEmpty().withMessage('Description is required.');

const skuField = (excludeIdFromReq = false) =>
  body('sku')
    .trim()
    .notEmpty().withMessage('SKU is required.')
    .isLength({ max: 100 }).withMessage('SKU must be 100 characters or fewer.')
    .custom(async (sku, { req }) => {
      const excludeId = excludeIdFromReq ? Number(req.params.id) : null;
      const exists = await skuExists(sku, excludeId);
      if (exists) throw new Error(`SKU "${sku}" is already in use.`);
    });

const quantityField = body('quantity')
  .notEmpty().withMessage('Quantity is required.')
  .isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer.')
  .toInt();

const priceField = body('price')
  .notEmpty().withMessage('Price is required.')
  .isFloat({ min: 0 }).withMessage('Price must be a non-negative number.')
  .toFloat();

const categoryIdField = body('category_id')
  .notEmpty().withMessage('Category is required.')
  .isInt({ min: 1 }).withMessage('Category must be a valid selection.')
  .toInt();

const supplierIdField = body('supplier_id')
  .notEmpty().withMessage('Supplier is required.')
  .isInt({ min: 1 }).withMessage('Supplier must be a valid selection.')
  .toInt();

const locationIdField = body('location_id')
  .notEmpty().withMessage('Location is required.')
  .isInt({ min: 1 }).withMessage('Location must be a valid selection.')
  .toInt();


// POST /inventory — create
const createItemValidator = [
  nameField,
  descriptionField,
  skuField(false),
  quantityField,
  priceField,
  categoryIdField,
  supplierIdField,
  locationIdField,
];


// PUT /inventory/:id — full update
const updateItemValidator = [
  idParam,
  nameField,
  descriptionField,
  skuField(true), // excludes current item from duplicate SKU check
  quantityField,
  priceField,
  categoryIdField,
  supplierIdField,
  locationIdField,
];


// GET /inventory/:id  |  DELETE /inventory/:id
const itemIdValidator = [idParam];


// GET /inventory?search=  — search query param
const searchItemsValidator = [
  query('search')
    .trim()
    .notEmpty().withMessage('Search term is required.')
    .isLength({ max: 255 }).withMessage('Search term must be 255 characters or fewer.'),
];

module.exports = {
  createItemValidator,
  updateItemValidator,
  itemIdValidator,
  searchItemsValidator,
};