const db = require("../db/queries/suppliersQueries");

async function getAllSuppliers(req, res) {
    const suppliers = await db.getAllSuppliers();
    console.log("Suppliers: ", suppliers);
    res.json({ suppliers });
}

async function getSupplierById(req, res) {
    const id = req.params.id;
    const supplier = await db.getSupplierById(id);

    if (!supplier) {
        return res.status(404).json({ error: `Supplier with id ${id} not found` });
    }

    console.log("Supplier: ", supplier);
    res.json({ supplier });
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

    console.log("Supplier items: ", { supplier, items });
    res.json({ supplier, items });
}

async function searchSuppliers(req, res) {
    const { search } = req.query;
    const suppliers = await db.searchSuppliers(search);

    console.log("Search results: ", suppliers);
    res.json({ suppliers });
}

async function createSupplier(req, res) {
    const { name, email, phone } = req.body;
    const supplier = await db.createSupplier({ name, email, phone });

    console.log("Created supplier:", supplier);
    res.status(201).json({ supplier });
}

async function updateSupplier(req, res) {
    const id = req.params.id;
    const { name, email, phone } = req.body;
    const supplier = await db.updateSupplier(id, { name, email, phone });

    if (!supplier) {
        return res.status(404).json({ error: `Supplier with id ${id} not found` });
    }

    console.log("Updated supplier:", supplier);
    res.json({ supplier });
}

async function deleteSupplier(req, res) {
    const id = req.params.id;
    const supplier = await db.deleteSupplier(id);

    if (!supplier) {
        return res.status(404).json({ error: `Supplier with id ${id} not found` });
    }

    console.log("Deleted supplier:", supplier);
    res.json({ message: `Supplier ${id} deleted`, supplier });
}

module.exports = {
    getAllSuppliers,
    getSupplierById,
    getSupplierItems,
    searchSuppliers,
    createSupplier,
    updateSupplier,
    deleteSupplier,
};

