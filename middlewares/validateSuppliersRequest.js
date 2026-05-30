const { validationResult } = require("express-validator");
const { createSupplierValidator } = require("../validations/suppliersValidators");
const { updateSupplierValidator } = require("../validations/suppliersValidators");
const db = require("../db/queries/suppliersQueries");

const validateSupplierCreate = [
    ...createSupplierValidator,
    (req, res, next) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).render("suppliers/create", {
                title: "Add New Supplier",
                errors: result.array(),
                body: req.body,
            });
        }

        next();
    },
];

const validateSupplierEdit = [
    ...updateSupplierValidator,
    async (req, res, next) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const supplier = await db.getSupplierById(req.params.id);

            return res.status(400).render("suppliers/edit", {
                title: "Edit Supplier",
                errors: result.array(),
                body: req.body,
                supplier,
            });
        }

        next();
    },
];


module.exports = {
    validateSupplierCreate,
    validateSupplierEdit
}