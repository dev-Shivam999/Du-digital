import express from "express";
import {
    getFormEmployeesAddresses,
    getFormEmployeesAddressById,
    getFormEmployeesAddressesBySlug,
    createFormEmployeesAddress,
    updateFormEmployeesAddress,
    deleteFormEmployeesAddress
} from "../controllers/formEmployeesAddress.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Get all form employees addresses (optionally filter by FormSlug)
router.get("/", getFormEmployeesAddresses);

// Get form employees addresses by form slug
router.get("/by-slug/:slug", getFormEmployeesAddressesBySlug);

// Get single form employees address by ID
router.get("/:id", getFormEmployeesAddressById);

// Create a new form employees address

router.use(protect);
router.post("/", createFormEmployeesAddress);

// Update a form employees address
router.put("/:id", updateFormEmployeesAddress);

// Delete a form employees address
router.delete("/:id", deleteFormEmployeesAddress);

export default router;
