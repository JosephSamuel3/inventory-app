const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");
const { validateCategoryCreate, validateCategoryEdit, validateCategorySearch } = require("../middlewares/validateCategoryRequest");

const {
    getAllCategories,
    getCategoryItems,
    searchCategories,
    getCreateForm,
    createCategory,
    getEditForm,
    updateCategory,
    deleteCategory,
} = require("../controllers/categoriesController");

const {
    categoryIdValidator,
} = require("../validations/categoryValidators");

const categoryRouter = Router();


categoryRouter.get("/", getAllCategories);
categoryRouter.get("/search", validateCategorySearch, searchCategories);
categoryRouter.get("/create", getCreateForm);
categoryRouter.post("/", validateCategoryCreate, createCategory);
categoryRouter.get("/:id", categoryIdValidator, validateRequest("categories/index", { categories: [], title: "Categories" }), getCategoryItems);
categoryRouter.get("/:id/edit", categoryIdValidator, validateRequest("categories/edit"), getEditForm);
categoryRouter.post("/:id", validateCategoryEdit, updateCategory);
categoryRouter.post("/:id/delete", categoryIdValidator, validateRequest("categories/index", { categories: [], title: "Categories" }), deleteCategory);

module.exports = categoryRouter;