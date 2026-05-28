const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");

const {
    getAllSuppliers,
    getSupplierById,
    getSupplierItems,
    searchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/suppliersController");

const {
    createSupplierValidator,
    updateSupplierValidator,
    supplierIdValidator,
} = require("../validations/suppliersValidators");

const suppliersRouter = Router();

suppliersRouter.get("/", getAllSuppliers);
suppliersRouter.get("/search", searchSuppliers);
suppliersRouter.get("/:id", supplierIdValidator, validateRequest, getSupplierById);
suppliersRouter.get("/:id/items", supplierIdValidator, validateRequest, getSupplierItems);
suppliersRouter.post("/", createSupplierValidator, validateRequest, createSupplier);
suppliersRouter.put("/:id", supplierIdValidator, updateSupplierValidator, validateRequest, updateSupplier);
suppliersRouter.delete("/:id", supplierIdValidator, validateRequest, deleteSupplier);

module.exports = suppliersRouter;
