import express from "express";
import {
    getOfficeTypes,
    createOfficeType,
    deleteOfficeType,
    getLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    getGroupedOffices
} from "../controllers/office.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Office Types
router.get("/types", getOfficeTypes);
router.get("/locations", getLocations);
router.get("/locations/grouped", getGroupedOffices);

router.use(protect);
router.post("/types", createOfficeType);
router.delete("/types/:id", deleteOfficeType);

// Office Locations
router.post("/locations", createLocation);
router.put("/locations/:id", updateLocation);
router.delete("/locations/:id", deleteLocation);

export default router;
