import express from "express";
import multer from "multer";
import path from "path";
import {
    getCategoryBySlug,
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    createReport,
    updateReport,
    deleteReport,
    getDashboardStats
} from "../controllers/investor.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Multer Config
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Stats Route (Placed before :slug to avoid conflict if slug matches 'stats', though unlikely with 'category' prefix)
router.get("/stats", getDashboardStats);

// Category Routes
router.get("/categories", getAllCategories);
router.get("/category/:slug", getCategoryBySlug);
router.use(protect);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// Report Routes
router.post("/report", upload.single("pdf"), createReport);
router.put("/report/:id", upload.single("pdf"), updateReport);
router.delete("/report/:id", deleteReport);

export default router;
