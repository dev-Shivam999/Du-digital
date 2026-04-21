import express from "express";
import { createCareer, getCareers, deleteCareer, updateCareer } from "../controllers/career.controller";

const router = express.Router();

router.post("/", createCareer);
router.get("/", getCareers);
router.put("/:id", updateCareer);
router.delete("/:id", deleteCareer);

export default router;
