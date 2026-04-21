import express from "express";
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from "../controllers/blog.controller";

const router = express.Router();

import multer from "multer";
import path from "path";
import { protect } from "../middleware/auth.middleware";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.get("/", getBlogs);
router.get("/:id", getBlogById);
router.use(protect);
router.post("/", upload.single("featuredImage"), createBlog);
router.put("/:id", upload.single("featuredImage"), updateBlog);
router.delete("/:id", deleteBlog);

export default router;
