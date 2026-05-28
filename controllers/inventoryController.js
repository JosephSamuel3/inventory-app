const db = require("../db/queries/inventoryQueries");

async function getAllItems(req, res) {
    const items = await db.getAllItems();
    console.log("Items: ", items);
    res.json({ items });
}

async function getItemById(req, res) {
    const id = req.params.id;
    const item = await db.getItemById(id);

    if (!item) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
    }

    console.log("Item: ", item);
    res.json({ item });
}

async function searchItems(req, res) {
    const { search } = req.query;
    const items = await db.searchItems(search);

    console.log("Search results: ", items);
    res.json({ items });
}

async function getItemsByCategory(req, res) {
    const categoryId = req.params.categoryId;
    const items = await db.getItemsByCategory(categoryId);

    console.log("Items by category: ", items);
    res.json({ items });
}

async function getItemsBySupplier(req, res) {
    const supplierId = req.params.supplierId;
    const items = await db.getItemsBySupplier(supplierId);

    console.log("Items by supplier: ", items);
    res.json({ items });
}

async function getItemsByLocation(req, res) {
    const locationId = req.params.locationId;
    const items = await db.getItemsByLocation(locationId);

    console.log("Items by location: ", items);
    res.json({ items });
}

async function getLowStockItems(req, res) {
    const { threshold = 5 } = req.query;
    const items = await db.getLowStockItems(parseInt(threshold));

    console.log("Low stock items: ", items);
    res.json({ items });
}

async function createItem(req, res) {
    const { name, description, sku, quantity, price, category_id, supplier_id, location_id } = req.body;
    const item = await db.createItem({ name, description, sku, quantity, price, category_id, supplier_id, location_id });

    console.log("Created item:", item);
    res.status(201).json({ item });
}

async function updateItem(req, res) {
    const id = req.params.id;
    const { name, description, sku, quantity, price, category_id, supplier_id, location_id } = req.body;
    const item = await db.updateItem(id, { name, description, sku, quantity, price, category_id, supplier_id, location_id });

    if (!item) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
    }

    console.log("Updated item:", item);
    res.json({ item });
}

async function updateItemQuantity(req, res) {
    const id = req.params.id;
    const { quantity } = req.body;
    const item = await db.updateItemQuantity(id, quantity);

    if (!item) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
    }

    console.log("Updated item quantity:", item);
    res.json({ item });
}

async function deleteItem(req, res) {
    const id = req.params.id;
    const item = await db.deleteItem(id);

    if (!item) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
    }

    console.log("Deleted item:", item);
    res.json({ message: `Item ${id} deleted`, item });
}

module.exports = {
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
};
