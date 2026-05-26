const db = require("../db/queries/locationsQueries");

async function getAllLocations(req, res) {
    const locations = await db.getAllLocations();
    console.log("Locations: ", locations);
    res.json({ locations });
};

async function getLocationById(req, res) {
    const id = req.params.id;
    const location = await db.getLocationById(id);

    if (!location) {
        return res.status(404).json({ error: `location with id ${id} not found` });
    };

    console.log("Location: ", location);
    res.json({ location });
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
        createdAt: rows[0].location_created_at,
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

    console.log("Location items: ", { location, items });
    res.json({ location, items });
};

async function createLocation(req, res) {
    const { name } = req.body;
    const location = await db.createLocation(name);

    console.log("Created location:", location);
    res.status(201).json({ location });
}

async function updateLocation(req, res) {
    const id = req.params.id;
    const { name } = req.body;
    const location = await db.updateLocation(id, name);

    if (!location) {
        return res.status(404).json({ error: `Locaton with id ${id} not found` });
    }

    console.log("Updated location:", location);
    res.json({ location });
}

async function deleteLocation(req, res) {
    const id = req.params.id;
    const location = await db.deleteLocation(id);

    if (!location) {
        return res.status(404).json({ error: `Location with id ${id} not found` });
    }

    console.log("Deleted location:", location);
    res.json({ message: `Location ${id} deleted`, location });
}

module.exports = {
    getAllLocations,
    getLocationById,
    getLocationItems,
    createLocation,
    updateLocation,
    deleteLocation,
}