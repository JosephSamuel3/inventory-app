const { Router } = require("express");
const validateRequest = require("../middlewares/validateRequest");

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
    createLocationValidator,
    updateLocationValidator,
    locationIdValidator,
} = require("../validations/locationValidators");

const locationRouter = Router();

locationRouter.get("/", getAllLocations);
locationRouter.get("/create",getCreateForm);                                                       
locationRouter.post("/", createLocationValidator, validateRequest, createLocation);
locationRouter.get("/:id/items", locationIdValidator, validateRequest, getLocationItems);
locationRouter.get("/:id/edit", locationIdValidator, validateRequest, getEditForm);                 
locationRouter.post("/:id", locationIdValidator, updateLocationValidator, validateRequest, updateLocation);
locationRouter.post("/:id/delete", locationIdValidator, validateRequest, deleteLocation);

module.exports = locationRouter;