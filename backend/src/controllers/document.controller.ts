import { Request, Response } from "express";
import DocumentRequirement from "../models/Documents.model";
import Form from "../models/Pages.model";

// Get all document requirements
export const getDocuments = async (req: Request, res: Response) => {
    try {
        const { formId } = req.query;

        const filter: any = {};
        if (formId) {
            filter.formId = formId;
        }

        const documents = await DocumentRequirement.find(filter)
            .populate('formId', 'name slug')
            .sort({ order: 1 });

        res.status(200).json(documents);
    } catch (error) {
        res.status(500).json({ message: "Error fetching documents", error });
    }
};

// Get single document by ID
export const getDocumentById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const document = await DocumentRequirement.findById(id)
            .populate('formId', 'name slug');

        if (!document) {
            return res.status(404).json({ message: "Document requirement not found" });
        }

        res.status(200).json(document);
    } catch (error) {
        res.status(500).json({ message: "Error fetching document", error });
    }
};

// Create a new document requirement
export const createDocument = async (req: Request, res: Response) => {
    try {
        const { formId, title, description, applicableFor, isMandatory, order, isActive } = req.body;

        if (!formId || !title) {
            return res.status(400).json({ message: "Form ID and title are required" });
        }

        // Verify form exists
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        // Get max order for this form
        const maxOrder = await DocumentRequirement.findOne({ formId })
            .sort({ order: -1 })
            .select('order');
        const newOrder = order !== undefined ? order : (maxOrder?.order ?? -1) + 1;

        const newDocument = new DocumentRequirement({
            formId,
            title,
            description,
            applicableFor,
            isMandatory: isMandatory !== undefined ? isMandatory : true,
            order: newOrder,
            isActive: isActive !== undefined ? isActive : true
        });

        const savedDocument = await newDocument.save();
        const populated = await savedDocument.populate('formId', 'name slug');

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: "Error creating document", error });
    }
};

// Update a document requirement
export const updateDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If formId is being updated, verify form exists
        if (updateData.formId) {
            const form = await Form.findById(updateData.formId);
            if (!form) {
                return res.status(404).json({ message: "Form not found" });
            }
        }

        const updatedDocument = await DocumentRequirement.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('formId', 'name slug');

        if (!updatedDocument) {
            return res.status(404).json({ message: "Document requirement not found" });
        }

        res.status(200).json(updatedDocument);
    } catch (error) {
        res.status(500).json({ message: "Error updating document", error });
    }
};

// Delete a document requirement
export const deleteDocument = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedDocument = await DocumentRequirement.findByIdAndDelete(id);

        if (!deletedDocument) {
            return res.status(404).json({ message: "Document requirement not found" });
        }

        res.status(200).json({ message: "Document requirement deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting document", error });
    }
};

// Bulk create documents for a form
export const bulkCreateDocuments = async (req: Request, res: Response) => {
    try {
        const { formId, documents } = req.body;

        if (!formId || !documents || !Array.isArray(documents)) {
            return res.status(400).json({ message: "Form ID and documents array are required" });
        }

        // Verify form exists
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        const documentsToCreate = documents.map((doc: any, index: number) => ({
            formId,
            title: doc.title,
            description: doc.description,
            applicableFor: doc.applicableFor,
            isMandatory: doc.isMandatory !== undefined ? doc.isMandatory : true,
            order: doc.order !== undefined ? doc.order : index,
            isActive: doc.isActive !== undefined ? doc.isActive : true
        }));

        const createdDocuments = await DocumentRequirement.insertMany(documentsToCreate);

        res.status(201).json(createdDocuments);
    } catch (error) {
        res.status(500).json({ message: "Error creating documents", error });
    }
};
