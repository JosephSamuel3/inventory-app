const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");

const {
    getAllLocations,
    getLocationById,
    getLocationItems,
    createLocation,
    updateLocation,
    deleteLocation
} = require("../controllers/locationsController");

const {
    createLocationValidator,
    updateLocationValidator,
    locationIdValidator,
} = require("../validations/locationValidators");

const locationRouter = new Router();

locationRouter.get("/", getAllLocations);
locationRouter.get("/:id", locationIdValidator, validateRequest, getLocationById);
locationRouter.get("/:id/items", locationIdValidator, validateRequest, getLocationItems);
locationRouter.post("/", createLocationValidator, validateRequest, createLocation);
locationRouter.put("/:id", locationIdValidator, updateLocationValidator, validateRequest, updateLocation);
locationRouter.delete("/:id", locationIdValidator, validateRequest, deleteLocation);

module.exports = locationRouter;