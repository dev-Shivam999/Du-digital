import express from "express";
import multer from "multer";
import path from "path";
import {
    getFormImages,
    getFormImageById,
    getFormImagesBySlug,
    createFormImage,
    updateFormImage,
    deleteFormImage,
    addImagesToFormImage,
    removeImageFromFormImage
} from "../controllers/formImage.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Multer setup for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Get all form images (optionally filter by formId/slug)
router.get("/", getFormImages);

// Get form images by form slug
router.get("/by-slug/:slug", getFormImagesBySlug);

// Get single form image by ID
router.get("/:id", getFormImageById);

// Create a new form image entry

router.use(protect);
router.post("/", upload.any(), createFormImage);

// Update a form image entry
router.put("/:id", upload.any(), updateFormImage);

// Add images to an existing form image entry
router.post("/:id/add-images", upload.any(), addImagesToFormImage);

// Remove a specific image from a form image entry
router.post("/:id/remove-image", removeImageFromFormImage);

// Delete a form image entry
router.delete("/:id", deleteFormImage);

export default router;
