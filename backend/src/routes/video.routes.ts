import express from "express";
import { getAllVideos, getVideosByCategory, createVideo, updateVideo, deleteVideo } from "../controllers/video.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getAllVideos);
router.get("/category/:category", getVideosByCategory);
router.use(protect);
router.post("/", createVideo);
router.put("/:id", updateVideo);
router.delete("/:id", deleteVideo);

export default router;