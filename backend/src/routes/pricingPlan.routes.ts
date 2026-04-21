import express from "express";
import {
    getPricingPlans,
    getPricingPlanById,
    createPricingPlan,
    updatePricingPlan,
    deletePricingPlan
} from "../controllers/pricingPlan.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getPricingPlans);
router.get("/:id", getPricingPlanById);

router.use(protect);
router.post("/", createPricingPlan);
router.put("/:id", updatePricingPlan);
router.delete("/:id", deletePricingPlan);

export default router;
