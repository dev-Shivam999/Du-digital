import express from "express";
import multer from "multer";
import path from "path";
import {
    getForms,
    getFormById,
    getFormBySlug,
    createForm,
    updateForm,
    deleteForm
} from "../controllers/form.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Multer Config for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `form-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.get("/", getForms);
router.get("/slug/:slug", getFormBySlug);
router.get("/:id", getFormById);

router.use(protect);
router.post("/", upload.single("image"), createForm);
router.put("/:id", upload.single("image"), updateForm);
router.delete("/:id", deleteForm);

export default router;

