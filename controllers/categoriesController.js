const db = require('../db/queries/categoriesQueries');

async function getAllCategories(req, res) {
    const categories = await db.getAllCategories();
    console.log("Categories: ", categories);
    res.json({ categories });
};

async function getCategoryById(req, res) {
    const id = req.params.id;
    const category = await db.getCategoryById(id);

    if (!category) {
        return res.status(404).json({ error: `Category with id ${id} not found` });
    }

    console.log("Category: ", category);
    res.json({ category });
};

async function getCategoryItems(req, res) {
    const id = req.params.id;
    const rows = await db.getCategoryWithItems(id);

    if (!rows || rows.length === 0) {
        return res.status(404).json({ error: `Category with id ${id} not found` });
    }

    const category = {
        id: rows[0].category_id,
        name: rows[0].category_name,
        createdAt: rows[0].category_created_at,
    };

    const items = rows
        .filter((row) => row.item_id !== null)
        .map((row) => ({
            id: row.item_id,
            name: row.item_name,
            sku: row.sku,
            quantity: row.quantity,
            price: row.price,
        }));

    console.log("Category items: ", { category, items });
    res.json({ category, items });
}

async function createCategory(req, res) {
    const { name } = req.body;
    const category = await db.createCategory(name);

    console.log("Created category:", category);
    res.status(201).json({ category });
}

async function updateCategory(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    const category = await db.updateCategory(id, name);

    if (!category) {
        return res.status(404).json({ error: `Category with id ${id} not found` });
    }

    console.log("Updated category:", category);
    res.json({ category });
}

async function deleteCategory(req, res) {
    const id = req.params.id;
    const category = await db.deleteCategory(id);

    if (!category) {
        return res.status(404).json({ error: `Category with id ${id} not found` });
    }

    console.log("Deleted category:", category);
    res.json({ message: `Category ${id} deleted`, category });
}

module.exports = {
    getAllCategories,
    getCategoryById,
    getCategoryItems,
    createCategory,
    updateCategory,
    deleteCategory,
}
