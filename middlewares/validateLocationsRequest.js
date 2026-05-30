const { validationResult } = require("express-validator");
const { createLocationValidator } = require("../validations/locationValidators");
const { updateLocationValidator } = require("../validations/locationValidators");
const db = require("../db/queries/locationsQueries");

const validateLocationCreate = [
    ...createLocationValidator,
    (req, res, next) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).render("locations/create", {
                title: "Add New Location",
                errors: result.array(),
                body: req.body,
            });
        }

        next();
    },
];

const validateLocationEdit = [
    ...updateLocationValidator,
    async (req, res, next) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const location = await db.getLocationById(req.params.id);

            return res.status(400).render("locations/edit", {
                title: "Edit location",
                errors: result.array(),
                body: req.body,
                location,
            });
        }

        next();
    },
];


module.exports = {
    validateLocationCreate,
    validateLocationEdit,
}