import express from "express";
import multer from "multer";
import path from "path";
import { createNews, getNews, updateNews, deleteNews } from "../controllers/news.controller";
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

router.get("/", getNews);
router.use(protect);
router.post("/", upload.single("image"), createNews);
router.put("/:id", upload.single("image"), updateNews);
router.delete("/:id", deleteNews);

export default router;

