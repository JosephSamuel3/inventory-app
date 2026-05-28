const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");

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
    createSupplierValidator,
    updateSupplierValidator,
    supplierIdValidator,
} = require("../validations/suppliersValidators");

const suppliersRouter = Router();

suppliersRouter.get("/", getAllSuppliers);
suppliersRouter.get("/search", searchSuppliers);
suppliersRouter.get("/create", getCreateForm);                                                      
suppliersRouter.post("/", createSupplierValidator, validateRequest, createSupplier);
suppliersRouter.get("/:id/items", supplierIdValidator, validateRequest, getSupplierItems);
suppliersRouter.get("/:id/edit", supplierIdValidator, validateRequest, getEditForm);                
suppliersRouter.post("/:id", supplierIdValidator, updateSupplierValidator, validateRequest, updateSupplier);
suppliersRouter.post("/:id/delete", supplierIdValidator, validateRequest, deleteSupplier);

module.exports = suppliersRouter;
