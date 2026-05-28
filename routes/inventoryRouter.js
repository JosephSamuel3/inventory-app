const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");

const {
    getAllItems,
    getItemById,
    searchItems,
    getItemsByCategory,
    getItemsBySupplier,
    getItemsByLocation,
    getLowStockItems,
    createItem,
    updateItem,
    updateItemQuantity,
    deleteItem,
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
inventoryRouter.get("/low-stock", getLowStockItems);
inventoryRouter.get("/category/:categoryId", getItemsByCategory);
inventoryRouter.get("/supplier/:supplierId", getItemsBySupplier);
inventoryRouter.get("/location/:locationId", getItemsByLocation);
inventoryRouter.get("/:id", itemIdValidator, validateRequest, getItemById);
inventoryRouter.post("/", createItemValidator, validateRequest, createItem);
inventoryRouter.put("/:id", updateItemValidator, validateRequest, updateItem);
inventoryRouter.patch("/:id/quantity", updateQuantityValidator, validateRequest, updateItemQuantity);
inventoryRouter.delete("/:id", itemIdValidator, validateRequest, deleteItem);

module.exports = inventoryRouter;

