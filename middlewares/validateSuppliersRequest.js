const { validationResult } = require("express-validator");
const { createSupplierValidator, updateSupplierValidator, searchSupplierValidator } = require("../validations/suppliersValidators");
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


const validateSupplierSearch = [
    ...searchSupplierValidator,
    async (req, res, next) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const suppliers = await db.getAllSuppliers();

            return res.status(400).render("suppliers/index", {
                title: "Suppliers",
                errors: result.array(),
                suppliers,
            });
        }

        next();
    },
];

module.exports = {
    validateSupplierCreate,
    validateSupplierEdit,
    validateSupplierSearch,
}