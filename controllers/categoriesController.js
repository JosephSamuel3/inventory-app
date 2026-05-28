const db = require('../db/queries/categoriesQueries');

async function getAllCategories(req, res) {
    const categories = await db.getAllCategories();
    res.render(
        "categories/index",
        categories
    );
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

    res.render(
        "categories/show",
        { category, items }
    );
}

// → res.render("categories/create")
async function getCreateForm(req, res) {
    
}

async function createCategory(req, res) {
    const { name } = req.body;
    const category = await db.createCategory(name);
    res.redirect("/categories");
}

// fetches category, → res.render("categories/edit", { category })
async function getEditForm(req, res) {
    
}

async function updateCategory(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    const category = await db.updateCategory(id, name);

    if (!category) {
        return res.status(404).json({ error: `Category with id ${id} not found` });
    }

    res.redirect(`categories/${id}`);
}

async function deleteCategory(req, res) {
    const id = req.params.id;
    const category = await db.deleteCategory(id);

    if (!category) {
        return res.status(404).json({ error: `Category with id ${id} not found` });
    }

    res.redirect("/categories");
}

module.exports = {
    getAllCategories,
    getCategoryItems,
    getCreateForm,
    createCategory,
    getEditForm,
    updateCategory,
    deleteCategory,
}
