import express from "express";
import { loginUser, getMe } from "../controllers/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.post("/login", loginUser);
router.get("/me", protect, getMe);

export default router;
