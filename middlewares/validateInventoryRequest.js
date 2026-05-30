const { validationResult } = require("express-validator");
const { createItemValidator } = require("../validations/inventoryValidators");
const { updateItemValidator } = require("../validations/inventoryValidators");
const db = require("../db/queries/inventoryQueries");
const categoriesDb = require("../db/queries/categoriesQueries");
const suppliersDb = require("../db/queries/suppliersQueries");
const locationsDb = require("../db/queries/locationsQueries");

const validateInventoryCreate = [
    ...createItemValidator,
    async (req, res, next) => {
        const result = validationResult(req);

        if (!result.isEmpty()) {
            const [categories, suppliers, locations] = await Promise.all([
                categoriesDb.getAllCategories(),
                suppliersDb.getAllSuppliers(),
                locationsDb.getAllLocations(),
            ]);

            return res.status(400).render("Inventory/create", {
                title: "Add New item",
                errors: result.array(),
                body: req.body,
                categories,
                suppliers,
                locations,
            });
        }

        next();
    }

]

const validateInventoryEdit = [
    ...updateItemValidator,
    async (req, res, next) => {
        const result = validationResult(req);
    
        if (!result.isEmpty()) {
            const [item, categories, suppliers, locations] = await Promise.all([
                db.getItemById(req.params.id),
                categoriesDb.getAllCategories(),
                suppliersDb.getAllSuppliers(),
                locationsDb.getAllLocations(),
            ]);
    
            return res.status(400).render("inventory/edit", {
                title: "Edit Item",
                errors: result.array(),
                body: req.body,
                item,
                categories,
                suppliers,
                locations,
            });
        }
    
        next();
    },
];

module.exports = {
    validateInventoryCreate,
    validateInventoryEdit,
}