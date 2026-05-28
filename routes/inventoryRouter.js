const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");

const {
    getAllItems,
    getItemById,
    searchItems,
    createItem,
    updateItem,
    deleteItem,
    getCreateForm,
    getEditForm,
} = require("../controllers/inventoryController");

const {
    createItemValidator,
    updateItemValidator,
    updateQuantityValidator,
    itemIdValidator,
    searchItemsValidator,
} = require("../validations/inventoryValidators");

const inventoryRouter = Router();

inventoryRouter.get("/", getAllItems);
inventoryRouter.get("/search", searchItemsValidator, validateRequest, searchItems);
inventoryRouter.get("/create", getCreateForm);                                          
inventoryRouter.post("/", createItemValidator, validateRequest, createItem);
inventoryRouter.get("/:id", itemIdValidator, validateRequest, getItemById);
inventoryRouter.get("/:id/edit", itemIdValidator, validateRequest, getEditForm);        
inventoryRouter.post("/:id", itemIdValidator, updateItemValidator, validateRequest, updateItem);
inventoryRouter.post("/:id/delete", itemIdValidator, validateRequest, deleteItem);

module.exports = inventoryRouter;

