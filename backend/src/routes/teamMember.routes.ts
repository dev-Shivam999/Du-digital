import express from "express";
import { getAllTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from "../controllers/teamMember.controller";

import multer from "multer";
import path from "path";
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

router.get("/", getAllTeamMembers);
router.use(protect);
router.post("/", upload.single("image"), createTeamMember);
router.put("/:id", upload.single("image"), updateTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;
