const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");

const {
    getAllCategories,
    getCategoryItems,
    getCreateForm,
    createCategory,
    getEditForm,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoriesController");

const {
    createCategoryValidator,
    updateCategoryValidator,
    categoryIdValidator,
} = require("../validations/categoryValidators");

const categoryRouter = Router();


categoryRouter.get("/", getAllCategories);
categoryRouter.get("/create", getCreateForm);                                              
categoryRouter.post("/", createCategoryValidator, validateRequest, createCategory);
categoryRouter.get("/:id/items", categoryIdValidator, validateRequest, getCategoryItems);
categoryRouter.get("/:id/edit", categoryIdValidator, validateRequest, getEditForm);        
categoryRouter.post("/:id", categoryIdValidator, updateCategoryValidator, validateRequest, updateCategory);
categoryRouter.post("/:id/delete", categoryIdValidator, validateRequest, deleteCategory);

module.exports = categoryRouter;