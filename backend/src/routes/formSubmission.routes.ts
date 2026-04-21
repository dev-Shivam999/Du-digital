import express from "express";
import {
    submitFormBySlug,
    getFormSubmissions,
    getFormSubmissionById,
    updateSubmissionStatus,
    deleteFormSubmission,
    getSubmissionsBySlug,
    getSubmissionStats,
    getTodaySubmissions
} from "../controllers/formSubmission.controller";

const router = express.Router();

// Public route - Submit form by slug
router.post("/slug/:slug", submitFormBySlug);

// Admin routes
router.get("/", getFormSubmissions);
router.get("/stats", getSubmissionStats);
router.get("/today", getTodaySubmissions);
router.get("/by-slug/:slug", getSubmissionsBySlug);
router.get("/:id", getFormSubmissionById);

router.put("/:id/status", updateSubmissionStatus);
router.delete("/:id", deleteFormSubmission);

export default router;
