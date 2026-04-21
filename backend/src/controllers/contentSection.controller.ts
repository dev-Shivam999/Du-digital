import { Request, Response } from "express";
import ContentSection from "../models/ContentSection.model";
import Form from "../models/Pages.model";

// Get all content sections
export const getContentSections = async (req: Request, res: Response) => {
    try {
        const { formId } = req.query;

        const filter: any = {};
        if (formId) {
            filter.formId = formId;
        }

        const sections = await ContentSection.find(filter)
            .populate('formId', 'name slug')
            .sort({ order: 1 });

        res.status(200).json(sections);
    } catch (error) {
        res.status(500).json({ message: "Error fetching content sections", error });
    }
};

// Get single content section by ID
export const getContentSectionById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const section = await ContentSection.findById(id)
            .populate('formId', 'name slug');

        if (!section) {
            return res.status(404).json({ message: "Content section not found" });
        }

        res.status(200).json(section);
    } catch (error) {
        res.status(500).json({ message: "Error fetching content section", error });
    }
};

// Create a new content section
export const createContentSection = async (req: Request, res: Response) => {
    try {
        const { formId, sectionKey, title, contentHtml, youtubeUrl, tableData, badge, layout, order, isActive } = req.body;

        if (!formId || !sectionKey || !title) {
            return res.status(400).json({ message: "Form ID, sectionKey, and title are required" });
        }

        // Verify form exists
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        // Handle multiple image uploads (up to 4)
        let imageUrls: string[] = [];

        if (req.files && Array.isArray(req.files)) {
            // Accept both 'image' and 'images' fieldnames
            const uploadedFiles = (req.files as Express.Multer.File[]).filter(f => f.fieldname === 'images' || f.fieldname === 'image');
            imageUrls = uploadedFiles.map(
                (file) => `/uploads/${file.filename}`
            );
        }
        // Also support existing image URLs passed in body
        if (req.body.existingImages) {
            const existingImages = Array.isArray(req.body.existingImages)
                ? req.body.existingImages
                : [req.body.existingImages];
            imageUrls = [...imageUrls, ...existingImages];
        }

        // Get max order for this form
        const maxOrder = await ContentSection.findOne({ formId })
            .sort({ order: -1 })
            .select('order');
        const newOrder = order !== undefined ? order : (maxOrder?.order ?? -1) + 1;

        // Parse tableData if it's a string
        let parsedTableData = tableData;
        if (typeof tableData === 'string') {
            try {
                parsedTableData = JSON.parse(tableData);
            } catch (e) {
                parsedTableData = null;
            }
        }

        const newSection = new ContentSection({
            formId,
            sectionKey,
            title,
            contentHtml: contentHtml || '',
            youtubeUrl: youtubeUrl || '',
            tableData: parsedTableData || { headers: [], rows: [] },
            images: imageUrls,
            badge: badge || {},
            layout: layout || 'LEFT_TEXT_RIGHT_IMAGE',
            order: newOrder,
            isActive: isActive !== undefined ? isActive : true
        });

        const savedSection = await newSection.save();
        const populated = await savedSection.populate('formId', 'name slug');

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: "Error creating content section", error });
    }
};

// Update a content section
export const updateContentSection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Remove any images field from body that might conflict (it comes as text, not files)
        delete updateData.images;

        // If formId is being updated, verify form exists
        if (updateData.formId) {
            const form = await Form.findById(updateData.formId);
            if (!form) {
                return res.status(404).json({ message: "Form not found" });
            }
        }

        // Parse tableData if it's a string
        if (updateData.tableData && typeof updateData.tableData === 'string') {
            try {
                updateData.tableData = JSON.parse(updateData.tableData);
            } catch (e) {
                delete updateData.tableData;
            }
        }

        // Handle multiple image uploads (up to 4)
        let imageUrls: string[] = [];

        // Keep existing images if provided
        if (updateData.existingImages) {
            const existing = Array.isArray(updateData.existingImages)
                ? updateData.existingImages
                : [updateData.existingImages];
            imageUrls = [...existing];
            delete updateData.existingImages;
        }

        // Add newly uploaded images
        if (req.files) {
            if (Array.isArray(req.files)) {
                // Accept both 'image' and 'images' fieldnames
                const uploadedFiles = (req.files as Express.Multer.File[]).filter(f => f.fieldname === 'images' || f.fieldname === 'image');
                const newImageUrls = uploadedFiles.map(
                    (file) => `/uploads/${file.filename}`
                );
                imageUrls = [...imageUrls, ...newImageUrls];
            }
        }

        // Always set images if we have any (uploaded or existing)
        if (imageUrls.length > 0) {
            updateData.images = imageUrls;
        }

        const updatedSection = await ContentSection.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('formId', 'name slug');

        if (!updatedSection) {
            return res.status(404).json({ message: "Content section not found" });
        }

        res.status(200).json(updatedSection);
    } catch (error) {
        res.status(500).json({ message: "Error updating content section", error });
    }
};

// Delete a content section
export const deleteContentSection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedSection = await ContentSection.findByIdAndDelete(id);

        if (!deletedSection) {
            return res.status(404).json({ message: "Content section not found" });
        }

        res.status(200).json({ message: "Content section deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting content section", error });
    }
};
