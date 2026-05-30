const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");
const { validateSupplierCreate, validateSupplierEdit } = require("../middlewares/validateSuppliersRequest");

const {
    getAllSuppliers,
    getSupplierItems,
    searchSuppliers,
    getCreateForm,
    createSupplier,
    getEditForm,
    updateSupplier,
    deleteSupplier,
} = require("../controllers/suppliersController");

const {
    searchSupplierValidator,
    supplierIdValidator,
} = require("../validations/suppliersValidators");

const suppliersRouter = Router();

suppliersRouter.get("/", getAllSuppliers);
suppliersRouter.get("/search", searchSupplierValidator, validateRequest("suppliers/index", { suppliers: [] }), searchSuppliers);
suppliersRouter.get("/create", getCreateForm);
suppliersRouter.post("/", validateSupplierCreate, createSupplier);
suppliersRouter.get("/:id", supplierIdValidator, validateRequest("suppliers/index", { suppliers: [] }), getSupplierItems);
suppliersRouter.get("/:id/edit", supplierIdValidator, validateRequest("suppliers/edit"), getEditForm);
suppliersRouter.post("/:id", validateSupplierEdit, updateSupplier);
suppliersRouter.post("/:id/delete", supplierIdValidator, validateRequest("suppliers/index"), deleteSupplier);

module.exports = suppliersRouter;
