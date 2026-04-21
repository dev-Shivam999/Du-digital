import express from "express";
import {
    getFAQs,
    getFAQById,
    createFAQ,
    updateFAQ,
    deleteFAQ
} from "../controllers/faq.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getFAQs);
router.get("/:id", getFAQById);

router.use(protect);
router.post("/", createFAQ);
router.put("/:id", updateFAQ);
router.delete("/:id", deleteFAQ);

export default router;
