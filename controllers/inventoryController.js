const db = require("../db/queries/inventoryQueries");
const asyncHandler = require("./asyncHandler");
const categoriesDb = require("../db/queries/categoriesQueries");
const suppliersDb = require("../db/queries/suppliersQueries");
const locationsDb = require("../db/queries/locationsQueries");


const getAllItems = asyncHandler(async (req, res) => {
    const items = await db.getAllItems();
    res.render("inventory/index", 
        { title: "Inventory", items });
});


const getItemById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const item = await db.getItemById(id);

    if (!item) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Item with id ${id} not found` });
    }

    res.render("inventory/show", { title: "Inventory item details", item })
});


const searchItems = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const items = await db.searchItems(search);

    res.render("inventory/index", { 
        title: "Inventory search result",
        items, search })
});

const getCreateForm = asyncHandler(async (req, res) => {
    const [categories, suppliers, locations] = await Promise.all([
        categoriesDb.getAllCategories(),
        suppliersDb.getAllSuppliers(),
        locationsDb.getAllLocations(),
    ]);
    res.render("inventory/create", 
        { 
            title: "Add new item", 
            categories, 
            suppliers, 
            locations 
        }
    );
});

const createItem = asyncHandler(async (req, res) => {
    const { name, description, sku, quantity, price, category_id, supplier_id, location_id } = req.body;
    const item = await db.createItem({ name, description, sku, quantity, price, category_id, supplier_id, location_id });
    res.redirect(`/inventory/${item.id}`);
});


const getEditForm = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const [item, categories, suppliers, locations] = await Promise.all([
        db.getItemById(id),
        categoriesDb.getAllCategories(),
        suppliersDb.getAllSuppliers(),
        locationsDb.getAllLocations(),
    ]);

    if (!item) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Item with id ${id} not found` });
    }

    res.render("inventory/edit", {
        title: "Edit item",
        item,
        categories,
        suppliers,
        locations,
    });
});


const updateItem = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { name, description, sku, quantity, price, category_id, supplier_id, location_id } = req.body;
    const item = await db.updateItem(id, { name, description, sku, quantity, price, category_id, supplier_id, location_id });

    if (!item) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Item with id ${id} not found` });
    }

    res.redirect(`/inventory/${id}`)
});

const deleteItem = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const item = await db.deleteItem(id);
    
    if (!item) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Item with id ${id} not found` });
    }

    res.redirect("/inventory")
});

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
