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
categoryRouter.post("/", createCategoryValidator, validateRequest("categories/create"), createCategory);
categoryRouter.get("/:id", categoryIdValidator, validateRequest("categories/index", { categories: [], title: "Categories" }), getCategoryItems);
categoryRouter.get("/:id/edit", categoryIdValidator, validateRequest("categories/edit"), getEditForm);
categoryRouter.post("/:id", categoryIdValidator, updateCategoryValidator, validateRequest("categories/edit"), updateCategory);
categoryRouter.post("/:id/delete", categoryIdValidator, validateRequest("categories/index", { categories: [], title: "Categories" }), deleteCategory);

module.exports = categoryRouter;