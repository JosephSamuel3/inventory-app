const db = require("../db/queries/locationsQueries");

async function getAllLocations(req, res) {
    const locations = await db.getAllLocations();
    res.render("locations/index", { locations });
};


async function getLocationItems(req, res) {
    const id = req.params.id;
    const rows = await db.getLocationWithItems(id);

    if (!rows || rows.length === 0) {
        return res.status(404).json({ error: `Location with id ${id} not found` });
    };

    const location = {
        id: rows[0].location_id,
        name: rows[0].location_name,
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

    res.render("locations/show", { location, items });
};

// → res.render("locations/create")
async function getCreateForm(req, res) {
    
};

async function createLocation(req, res) {
    const { name } = req.body;
    const location = await db.createLocation(name);
    res.redirect("/locations")
};

// → res.render("locations/edit", { location })
async function getEditForm(req, res) {
    
}

async function updateLocation(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    const location = await db.updateLocation(id, name);

    if (!location) {
        return res.status(404).json({ error: `Locaton with id ${id} not found` });
    }

    res.redirect(`/locations/${id}`)
};

async function deleteLocation(req, res) {
    const id = req.params.id;
    const location = await db.deleteLocation(id);

    if (!location) {
        return res.status(404).json({ error: `Location with id ${id} not found` });
    }

    res.redirect("/locations")
};

module.exports = {
    getAllLocations,
    getLocationItems,
    getCreateForm,
    createLocation,
    getEditForm,
    updateLocation,
    deleteLocation,
};