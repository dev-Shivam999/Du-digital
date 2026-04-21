import express from "express";
import multer from "multer";
import path from "path";
import {
    getContentSections,
    getContentSectionById,
    createContentSection,
    updateContentSection,
    deleteContentSection
} from "../controllers/contentSection.controller";
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

router.get("/", getContentSections);
router.get("/:id", getContentSectionById);

router.use(protect);
router.post("/", upload.any(), createContentSection);
router.put("/:id", upload.any(), updateContentSection);
router.delete("/:id", deleteContentSection);

export default router;
