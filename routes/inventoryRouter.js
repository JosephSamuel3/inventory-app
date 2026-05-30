const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest")
const { validateInventoryCreate, validateInventoryEdit } = require("../middlewares/validateInventoryRequest")

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
    itemIdValidator,
    searchItemsValidator,
} = require("../validations/inventoryValidators");

const inventoryRouter = Router();

inventoryRouter.get("/", getAllItems);
inventoryRouter.get("/search", searchItemsValidator, validateRequest("inventory/index", { items: [] }), searchItems);
inventoryRouter.get("/create", getCreateForm);                                          
inventoryRouter.post("/", validateInventoryCreate, createItem);
inventoryRouter.get("/:id", itemIdValidator, validateRequest("inventory/index"), getItemById);
inventoryRouter.get("/:id/edit", itemIdValidator, validateRequest("inventory/edit"), getEditForm);        
inventoryRouter.post("/:id", itemIdValidator, validateInventoryEdit, updateItem);
inventoryRouter.post("/:id/delete", itemIdValidator, validateRequest("inventory/index"), deleteItem);

module.exports = inventoryRouter;

