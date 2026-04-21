import express from "express";
import multer from "multer";
import path from "path";
import {
    getAllTravelPackages,
    createTravelPackage,
    updateTravelPackage,
    deleteTravelPackage
} from "../controllers/travelPackage.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

// Multer Config for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, `travel-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage });

router.get("/", getAllTravelPackages);
router.use(protect);
router.post("/", upload.single("bannerImage"), createTravelPackage);
router.put("/:id", upload.single("bannerImage"), updateTravelPackage);
router.delete("/:id", deleteTravelPackage);

export default router;
