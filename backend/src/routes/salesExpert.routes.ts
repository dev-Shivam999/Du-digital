
import express from "express";
import {
    addSalesExpert,
    getSalesExperts,
    updateSalesExpert,
    deleteSalesExpert
} from "../controllers/salesExpert.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getSalesExperts);
router.use(protect);
router.post("/", addSalesExpert);
router.put("/:id", updateSalesExpert);
router.delete("/:id", deleteSalesExpert);

export default router;
