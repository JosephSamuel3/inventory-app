const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");

const {
    getAllCategories,
    getCategoryById,
    getCategoryItems,
    createCategory,
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
categoryRouter.get("/:id", categoryIdValidator, validateRequest, getCategoryById);
categoryRouter.get("/:id/items", categoryIdValidator, validateRequest, getCategoryItems);
categoryRouter.post("/", createCategoryValidator, validateRequest, createCategory);
categoryRouter.put("/:id", categoryIdValidator, updateCategoryValidator, validateRequest, updateCategory);
categoryRouter.delete("/:id", categoryIdValidator, validateRequest, deleteCategory);

module.exports = categoryRouter;