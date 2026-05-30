const db = require("../db/queries/categoriesQueries");
const asyncHandler = require("./asyncHandler");

const getAllCategories = asyncHandler(async (req, res) => {
    const categories = await db.getAllCategories();

    res.render("categories/index", {
        title: "Categories",
        categories,
    });
});

const getCategoryItems = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const rows = await db.getCategoryWithItems(id);

    if (!rows || rows.length === 0) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Category with id ${id} not found`,
        });
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

    res.render("categories/show", {
        title: "Category items",
        category,
        items,
    });
});

const getCreateForm = asyncHandler(async (req, res) => {
    res.render("categories/create", {
        title: "Create Category",
    });
});

const createCategory = asyncHandler(async (req, res) => {
    const { name } = req.body;

    await db.createCategory(name);

    res.redirect("/categories");
});

const getEditForm = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const category = await db.getCategoryById(id);

    if (!category) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Category with id ${id} not found`,
        });
    }

    res.render("categories/edit", {
        title: "Edit Category",
        category,
    });
});

const updateCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const category = await db.updateCategory(id, name);

    if (!category) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Category with id ${id} not found`,
        });
    }

    res.redirect(`/categories/${id}`);
});

const deleteCategory = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const category = await db.deleteCategory(id);

    if (!category) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Category with id ${id} not found`,
        });
    }

    res.redirect("/categories");
});

module.exports = {
    getAllCategories,
    getCategoryItems,
    getCreateForm,
    createCategory,
    getEditForm,
    updateCategory,
    deleteCategory,
};
