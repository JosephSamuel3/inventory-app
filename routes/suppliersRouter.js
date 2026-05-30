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
    searchSupplierValidator,
    supplierIdValidator,
} = require("../validations/suppliersValidators");

const suppliersRouter = Router();

suppliersRouter.get("/", getAllSuppliers);
suppliersRouter.get("/search", searchSupplierValidator, validateRequest("suppliers/index", { suppliers: [] }),searchSuppliers);
suppliersRouter.get("/create", getCreateForm);                                                      
suppliersRouter.post("/", createSupplierValidator, validateRequest("suppliers/create"), createSupplier);
suppliersRouter.get("/:id", supplierIdValidator, validateRequest("suppliers/index", { suppliers: [] }), getSupplierItems);
suppliersRouter.get("/:id/edit", supplierIdValidator, validateRequest("suppliers/edit"), getEditForm);                
suppliersRouter.post("/:id", supplierIdValidator, updateSupplierValidator, validateRequest("suppliers/edit"), updateSupplier);
suppliersRouter.post("/:id/delete", supplierIdValidator, validateRequest("suppliers/index"), deleteSupplier);

module.exports = suppliersRouter;
