const { body, param, query } = require('express-validator');
const { locationNameExists } = require('../db/queries/locationsQueries');


const idParam = param('id')
  .isInt({ min: 1 }).withMessage('Location ID must be a positive integer.');

// Factory — returns a fresh chain each call so .custom() calls don't bleed between validators
const nameField = () =>
  body('name')
    .trim()
    .notEmpty().withMessage('Location name is required.')
    .isLength({ max: 255 }).withMessage('Location name must be 255 characters or fewer.');


// POST /locations — create
const createLocationValidator = [
  nameField().custom(async (name) => {
    const exists = await locationNameExists(name);
    if (exists) throw new Error(`A location named "${name}" already exists.`);
  }),
];


// PUT /locations/:id — update
const updateLocationValidator = [
  idParam,
  nameField().custom(async (name, { req }) => {
    const exists = await locationNameExists(name, Number(req.params.id));
    if (exists) throw new Error(`A location named "${name}" already exists.`);
  }),
];


// GET /locations/search
const searchLocationValidator = [
  query('search')
    .trim()
    .notEmpty().withMessage('Search term is required.')
    .isLength({ max: 255 }).withMessage('Search term must be 255 characters or fewer.'),
];


// DELETE /locations/:id  |  GET /locations/:id
const locationIdValidator = [idParam];

module.exports = {
  createLocationValidator,
  updateLocationValidator,
  searchLocationValidator,
  locationIdValidator,
};