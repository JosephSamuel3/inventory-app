const db = require("../db/queries/inventoryQueries");

async function getAllItems(req, res) {
    const items = await db.getAllItems();
    res.render("/inventory/index", { items });
}

async function getItemById(req, res) {
    const id = req.params.id;
    const item = await db.getItemById(id);

    if (!item) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
    }

    res.render("inventory/show", { item })
}

async function searchItems(req, res) {
    const { search } = req.query;
    const items = await db.searchItems(search);

    res.render("inventory/index", { items, search })
}

// needs categories, suppliers, locations for <select> dropdowns
// → const [categories, suppliers, locations] = await Promise.all([...])
// → res.render("inventory/create", { categories, suppliers, locations })
async function getCreateForm(req, res) { }

async function createItem(req, res) {
    const { name, description, sku, quantity, price, category_id, supplier_id, location_id } = req.body;
    const item = await db.createItem({ name, description, sku, quantity, price, category_id, supplier_id, location_id });

    res.redirect(`/inventory/${item.id}`)
}

// needs item + dropdown lists
// → res.render("inventory/edit", { item, categories, suppliers, locations })
async function getEditForm(req, res) { }

async function updateItem(req, res) {
    const id = req.params.id;
    const { name, description, sku, quantity, price, category_id, supplier_id, location_id } = req.body;
    const item = await db.updateItem(id, { name, description, sku, quantity, price, category_id, supplier_id, location_id });

    if (!item) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
    }

    res.redirect(`/inventory/${id}`)
}


async function deleteItem(req, res) {
    const id = req.params.id;
    const item = await db.deleteItem(id);

    if (!item) {
        return res.status(404).json({ error: `Item with id ${id} not found` });
    }

    res.redirect("/inventory")
}

module.exports = {
    getAllItems,
    getItemById,
    searchItems,
    getCreateForm,
    createItem,
    getEditForm,
    updateItem,
    deleteItem,
};
