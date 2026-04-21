import express from "express";
import {
    createTravelInquiry,
    getAllTravelInquiries,
    getTravelInquiryStats
} from "../controllers/travelInquiry.controller";

const router = express.Router();

// Public route - Create inquiry
router.post("/", createTravelInquiry);

// Admin routes - Get inquiries and stats
router.get("/", getAllTravelInquiries);
router.get("/stats", getTravelInquiryStats);

export default router;
