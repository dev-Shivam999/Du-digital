import express from "express";
import { createPartnerRequest, getPartnerRequests, getPartnerStats, updatePartnerStatus, getOfficialPartners } from "../controllers/partner.controller";
import { protect, hasPermission } from "../middleware/auth.middleware";

import upload from "../middleware/upload.middleware";

const router = express.Router();


router.post("/", createPartnerRequest);
router.get("/official", getOfficialPartners);
router.use(protect);
router.get("/", getPartnerRequests);
router.put("/:id", hasPermission("manage_partners"), upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'userImage', maxCount: 1 }]), updatePartnerStatus);
router.get("/stats", getPartnerStats);

export default router;
