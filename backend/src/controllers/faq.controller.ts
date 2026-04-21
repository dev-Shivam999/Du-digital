import { Request, Response } from "express";
import FAQ from "../models/FAQ.model";
import Form from "../models/Pages.model";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "../utils/cache";

// Get all FAQs
export const getFAQs = async (req: Request, res: Response) => {
    try {
        const { formId } = req.query;
        const cacheKey = `faqs_${formId || 'all'}`;

        // Check cache
        const cachedFAQs = getCache(cacheKey);
        if (cachedFAQs) {
            return res.status(200).json(cachedFAQs);
        }

        const filter: any = {};
        if (formId) {
            filter.formId = formId;
        }

        const faqs = await FAQ.find(filter)
            .populate('formId', 'name slug')
            .sort({ order: 1 });

        // Set cache
        setCache(cacheKey, faqs, 300);

        res.status(200).json(faqs);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQs", error });
    }
};

// Get single FAQ by ID
export const getFAQById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cacheKey = `faq_${id}`;

        // Check cache
        const cachedFAQ = getCache(cacheKey);
        if (cachedFAQ) {
            return res.status(200).json(cachedFAQ);
        }

        const faq = await FAQ.findById(id)
            .populate('formId', 'name slug');

        if (!faq) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Set cache
        setCache(cacheKey, faq, 300);

        res.status(200).json(faq);
    } catch (error) {
        res.status(500).json({ message: "Error fetching FAQ", error });
    }
};

// Create a new FAQ
export const createFAQ = async (req: Request, res: Response) => {
    try {
        const { formId, question, answer, order, isActive } = req.body;

        if (!formId || !question || !answer) {
            return res.status(400).json({ message: "Form ID, question, and answer are required" });
        }

        // Verify form exists
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        // Get max order for this form
        const maxOrder = await FAQ.findOne({ formId })
            .sort({ order: -1 })
            .select('order');
        const newOrder = order !== undefined ? order : (maxOrder?.order ?? -1) + 1;

        const newFAQ = new FAQ({
            formId,
            question,
            answer,
            order: newOrder,
            isActive: isActive !== undefined ? isActive : true
        });

        const savedFAQ = await newFAQ.save();
        const populated = await savedFAQ.populate('formId', 'name slug');

        // Invalidate caches
        deleteCacheByPattern('faqs_');
        // Also invalidate form cache because FAQs are included in getFormBySlug
        deleteCacheByPattern('form_');

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: "Error creating FAQ", error });
    }
};

// Update a FAQ
export const updateFAQ = async (req: Request, res: Response) => {
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

        const updatedFAQ = await FAQ.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('formId', 'name slug');

        if (!updatedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Invalidate caches
        deleteCacheByPattern('faqs_');
        deleteCache(`faq_${id}`);
        deleteCacheByPattern('form_'); // For the specific form it belongs to

        res.status(200).json(updatedFAQ);
    } catch (error) {
        res.status(500).json({ message: "Error updating FAQ", error });
    }
};

// Delete a FAQ
export const deleteFAQ = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedFAQ = await FAQ.findByIdAndDelete(id);

        if (!deletedFAQ) {
            return res.status(404).json({ message: "FAQ not found" });
        }

        // Invalidate caches
        deleteCacheByPattern('faqs_');
        deleteCache(`faq_${id}`);
        deleteCacheByPattern('form_');

        res.status(200).json({ message: "FAQ deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting FAQ", error });
    }
};
