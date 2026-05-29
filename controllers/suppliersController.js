const db = require("../db/queries/suppliersQueries");

async function getAllSuppliers(req, res) {
    const suppliers = await db.getAllSuppliers();
    res.render("suppliers/index" ,{ suppliers });
}


async function getSupplierItems(req, res) {
    const id = req.params.id;
    const rows = await db.getSupplierWithItems(id);

    if (!rows || rows.length === 0) {
        return res.status(404).json({ error: `Supplier with id ${id} not found` });
    }

    const supplier = {
        id: rows[0].supplier_id,
        name: rows[0].supplier_name,
        email: rows[0].supplier_email,
        phone: rows[0].supplier_phone,
        createdAt: rows[0].supplier_created_at,
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
        "suppliers/show",
        { supplier, items },
    );
}

async function searchSuppliers(req, res) {
    const { search } = req.query;
    const suppliers = await db.searchSuppliers(search);
    res.render("suppliers/index", { suppliers });
}

// → res.render("suppliers/create")
async function getCreateForm(req, res) {
    res.render("suppliers/create",
        { title: "Add new supplier"}
    );
 };      

async function createSupplier(req, res) {
    const { name, email, phone } = req.body;
    const supplier = await db.createSupplier({ name, email, phone });

    res.redirect("/suppliers");
}

// → res.render("suppliers/edit", { supplier })
async function getEditForm(req, res) {
    const id = req.params.id;
    const supplier = await db.getSupplierById;

    if(!supplier) {
        return res.status(404).json({ error: `Supplier with id ${id} not found` });
    }

    res.render("suppliers/edit", { supplier });
 }           

async function updateSupplier(req, res) {
    const id = req.params.id;
    const { name, email, phone } = req.body;
    const supplier = await db.updateSupplier(id, { name, email, phone });

    if (!supplier) {
        return res.status(404).json({ error: `Supplier with id ${id} not found` });
    };

    res.redirect(`/suppliers/${id}`);;
}

async function deleteSupplier(req, res) {
    const id = req.params.id;
    const supplier = await db.deleteSupplier(id);

    if (!supplier) {
        return res.status(404).json({ error: `Supplier with id ${id} not found` });
    }

    res.redirect("/suppliers");
}

module.exports = {
    getAllSuppliers,
    getSupplierItems,
    searchSuppliers,
    getCreateForm,
    createSupplier,
    getEditForm,
    updateSupplier,
    deleteSupplier,
};

