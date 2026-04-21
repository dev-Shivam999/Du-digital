import express from "express";
import multer from "multer";
import path from "path";
import { createEmployee, getEmployees } from "../controllers/employee.controller";

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

router.post("/", upload.single("cv"), createEmployee);
router.get("/", getEmployees);

export default router;
