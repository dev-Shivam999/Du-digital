import { Request, Response } from "express";
import FormImage from "../models/FormImages.model";
import Form from "../models/Pages.model";

// Get all form images
export const getFormImages = async (req: Request, res: Response) => {
    try {
        const { formId } = req.query;

        const filter: any = {};
        if (formId) {
            filter.formId = formId;
        }

        const formImages = await FormImage.find(filter).sort({ createdAt: -1 });

        // Populate form details for each form image
        const populatedFormImages = await Promise.all(
            formImages.map(async (formImage) => {
                const form = await Form.findOne({ slug: formImage.formId }).select('name slug');
                return {
                    ...formImage.toObject(),
                    form: form || { name: 'Unknown', slug: formImage.formId }
                };
            })
        );

        res.status(200).json(populatedFormImages);
    } catch (error) {
        res.status(500).json({ message: "Error fetching form images", error });
    }
};

// Get single form image by ID
export const getFormImageById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const formImage = await FormImage.findById(id);

        if (!formImage) {
            return res.status(404).json({ message: "Form image not found" });
        }

        // Get form details
        const form = await Form.findOne({ slug: formImage.formId }).select('name slug');

        res.status(200).json({
            ...formImage.toObject(),
            form: form || { name: 'Unknown', slug: formImage.formId }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching form image", error });
    }
};

// Get form images by form slug
export const getFormImagesBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const formImages = await FormImage.find({ formId: slug, isActive: true }).sort({ createdAt: -1 });

        // Get form details
        const form = await Form.findOne({ slug }).select('name slug');

        res.status(200).json({
            form: form || { name: 'Unknown', slug },
            images: formImages
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching form images by slug", error });
    }
};

// Create a new form image entry
export const createFormImage = async (req: Request, res: Response) => {
    try {
        const { formId, title, isActive } = req.body;

        if (!formId || !title) {
            return res.status(400).json({ message: "Form ID (slug) and title are required" });
        }

        // Verify form exists by slug
        const form = await Form.findOne({ slug: formId });
        if (!form) {
            return res.status(404).json({ message: "Form not found with the given slug" });
        }

        // Handle multiple image uploads
        let imageUrls: string[] = [];

        if (req.files && Array.isArray(req.files)) {
            const uploadedFiles = (req.files as Express.Multer.File[]).filter(
                f => f.fieldname === 'images' || f.fieldname === 'image'
            );
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

        const newFormImage = new FormImage({
            formId,
            title,
            images: imageUrls,
            isActive: isActive !== undefined ? isActive : true
        });

        const savedFormImage = await newFormImage.save();

        res.status(201).json({
            ...savedFormImage.toObject(),
            form: { name: form.name, slug: form.slug }
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating form image", error });
    }
};

// Update a form image entry
export const updateFormImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // Remove any images field from body that might conflict
        delete updateData.images;

        // If formId is being updated, verify form exists
        if (updateData.formId) {
            const form = await Form.findOne({ slug: updateData.formId });
            if (!form) {
                return res.status(404).json({ message: "Form not found with the given slug" });
            }
        }

        // Handle image updates
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
        if (req.files && Array.isArray(req.files)) {
            const uploadedFiles = (req.files as Express.Multer.File[]).filter(
                f => f.fieldname === 'images' || f.fieldname === 'image'
            );
            const newImageUrls = uploadedFiles.map(
                (file) => `/uploads/${file.filename}`
            );
            imageUrls = [...imageUrls, ...newImageUrls];
        }

        // Set images if we have any (uploaded or existing)
        if (imageUrls.length > 0) {
            updateData.images = imageUrls;
        }

        const updatedFormImage = await FormImage.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedFormImage) {
            return res.status(404).json({ message: "Form image not found" });
        }

        // Get form details
        const form = await Form.findOne({ slug: updatedFormImage.formId }).select('name slug');

        res.status(200).json({
            ...updatedFormImage.toObject(),
            form: form || { name: 'Unknown', slug: updatedFormImage.formId }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating form image", error });
    }
};

// Delete a form image entry
export const deleteFormImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedFormImage = await FormImage.findByIdAndDelete(id);

        if (!deletedFormImage) {
            return res.status(404).json({ message: "Form image not found" });
        }

        res.status(200).json({ message: "Form image deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting form image", error });
    }
};

// Add images to an existing form image entry
export const addImagesToFormImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const formImage = await FormImage.findById(id);
        if (!formImage) {
            return res.status(404).json({ message: "Form image not found" });
        }

        let newImageUrls: string[] = [];

        if (req.files && Array.isArray(req.files)) {
            const uploadedFiles = (req.files as Express.Multer.File[]).filter(
                f => f.fieldname === 'images' || f.fieldname === 'image'
            );
            newImageUrls = uploadedFiles.map(
                (file) => `/uploads/${file.filename}`
            );
        }

        if (newImageUrls.length === 0) {
            return res.status(400).json({ message: "No images provided" });
        }

        // Append new images to existing ones
        const updatedImages = [...formImage.images, ...newImageUrls];

        const updatedFormImage = await FormImage.findByIdAndUpdate(
            id,
            { images: updatedImages },
            { new: true }
        );

        // Get form details
        const form = await Form.findOne({ slug: updatedFormImage?.formId }).select('name slug');

        res.status(200).json({
            ...updatedFormImage?.toObject(),
            form: form || { name: 'Unknown', slug: updatedFormImage?.formId }
        });
    } catch (error) {
        res.status(500).json({ message: "Error adding images", error });
    }
};

// Remove a specific image from a form image entry
export const removeImageFromFormImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { imageUrl } = req.body;

        if (!imageUrl) {
            return res.status(400).json({ message: "Image URL is required" });
        }

        const formImage = await FormImage.findById(id);
        if (!formImage) {
            return res.status(404).json({ message: "Form image not found" });
        }

        // Filter out the image to be removed
        const updatedImages = formImage.images.filter(img => img !== imageUrl);

        const updatedFormImage = await FormImage.findByIdAndUpdate(
            id,
            { images: updatedImages },
            { new: true }
        );

        // Get form details
        const form = await Form.findOne({ slug: updatedFormImage?.formId }).select('name slug');

        res.status(200).json({
            ...updatedFormImage?.toObject(),
            form: form || { name: 'Unknown', slug: updatedFormImage?.formId }
        });
    } catch (error) {
        res.status(500).json({ message: "Error removing image", error });
    }
};
