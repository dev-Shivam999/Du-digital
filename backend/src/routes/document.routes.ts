import express from "express";
import {
    getDocuments,
    getDocumentById,
    createDocument,
    updateDocument,
    deleteDocument,
    bulkCreateDocuments
} from "../controllers/document.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/", getDocuments);
router.get("/:id", getDocumentById);

router.use(protect);
router.post("/", createDocument);
router.post("/bulk", bulkCreateDocuments);
router.put("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
