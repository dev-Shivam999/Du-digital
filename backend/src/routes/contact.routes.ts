import express from "express";
import { createInquiry, getInquiries, getInquiryStats } from "../controllers/contact.controller";

const router = express.Router();

router.post("/", createInquiry);
router.get("/", getInquiries);
router.get("/stats", getInquiryStats);

export default router;
