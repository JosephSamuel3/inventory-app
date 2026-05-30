const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");
const { validateLocationCreate, validateLocationEdit } = require("../middlewares/validateLocationsRequest");

const {
    getAllLocations,
    getLocationItems,
    getCreateForm,
    createLocation,
    getEditForm,
    updateLocation,
    deleteLocation
} = require("../controllers/locationsController");

const {
    locationIdValidator,
} = require("../validations/locationValidators");

const locationRouter = Router();

locationRouter.get("/", getAllLocations);
locationRouter.get("/create", getCreateForm);
locationRouter.post("/", validateLocationCreate, createLocation);
locationRouter.get("/:id", locationIdValidator, validateRequest("locations/index"), getLocationItems);
locationRouter.get("/:id/edit", locationIdValidator, validateRequest("locations/edit"), getEditForm);
locationRouter.post("/:id", validateLocationEdit, updateLocation);
locationRouter.post("/:id/delete", locationIdValidator, validateRequest("locations/index"), deleteLocation);

module.exports = locationRouter;