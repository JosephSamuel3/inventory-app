const db = require("../db/queries/locationsQueries");
const asyncHandler = require("./asyncHandler");

const getAllLocations = asyncHandler(async (req, res) => {
    const locations = await db.getAllLocations();

    res.render("locations/index", {
        title: "Storage Locations",
        locations,
    });
});

const getLocationItems = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const rows = await db.getLocationWithItems(id);

    if (!rows || rows.length === 0) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Location with id ${id} not found`,
        });
    }

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

    res.render("locations/show", {
        title: "Location Detail",
        location,
        items,
    });
});

const searchLocations = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const locations = await db.searchLocations(search);
    res.render("locations/index", { title: "Storage Locations", locations });
});

const getCreateForm = asyncHandler(async (req, res) => {
    res.render("locations/create", {
        title: "Add New Location",
    });
});

const createLocation = asyncHandler(async (req, res) => {
    const { name } = req.body;

    await db.createLocation(name);

    res.redirect("/locations");
});

const getEditForm = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const location = await db.getLocationById(id);

    if (!location) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Location with id ${id} not found`,
        });
    }

    res.render("locations/edit", {
        location,
    });
});

const updateLocation = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { name } = req.body;

    const location = await db.updateLocation(id, name);

    if (!location) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Location with id ${id} not found`,
        });
    }

    res.redirect(`/locations/${id}`);
});

const deleteLocation = asyncHandler(async (req, res) => {
    const id = req.params.id;

    const location = await db.deleteLocation(id);

    if (!location) {
        return res.status(404).render("error", {
            title: "Not Found",
            status: 404,
            error: `Location with id ${id} not found`,
        });
    }

    res.redirect("/locations");
});

module.exports = {
    getAllLocations,
    getLocationItems,
    searchLocations,
    getCreateForm,
    createLocation,
    getEditForm,
    updateLocation,
    deleteLocation,
};