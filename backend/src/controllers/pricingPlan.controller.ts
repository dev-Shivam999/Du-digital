import { Request, Response } from "express";
import PricingPlan from "../models/PricingPlan.model";
import Form from "../models/Pages.model";

// Get all pricing plans
export const getPricingPlans = async (req: Request, res: Response) => {
    try {
        const { formId } = req.query;

        const filter: any = {};
        if (formId) {
            filter.formId = formId;
        }

        const plans = await PricingPlan.find(filter)
            .populate('formId', 'name slug')
            .sort({ order: 1 });

        res.status(200).json(plans);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pricing plans", error });
    }
};

// Get single pricing plan by ID
export const getPricingPlanById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const plan = await PricingPlan.findById(id)
            .populate('formId', 'name slug');

        if (!plan) {
            return res.status(404).json({ message: "Pricing plan not found" });
        }

        res.status(200).json(plan);
    } catch (error) {
        res.status(500).json({ message: "Error fetching pricing plan", error });
    }
};

// Create a new pricing plan
export const createPricingPlan = async (req: Request, res: Response) => {
    try {
        const { formId, planName, description, price, features, order, isActive } = req.body;

        if (!formId || !planName || !price) {
            return res.status(400).json({ message: "Form ID, plan name, and price are required" });
        }

        // Verify form exists
        const form = await Form.findById(formId);
        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        // Get max order for this form
        const maxOrder = await PricingPlan.findOne({ formId })
            .sort({ order: -1 })
            .select('order');
        const newOrder = order !== undefined ? order : (maxOrder?.order ?? -1) + 1;

        const newPlan = new PricingPlan({
            formId,
            planName,
            description,
            price,
            features: features || [],
            order: newOrder,
            isActive: isActive !== undefined ? isActive : true
        });

        const savedPlan = await newPlan.save();
        const populated = await savedPlan.populate('formId', 'name slug');

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: "Error creating pricing plan", error });
    }
};

// Update a pricing plan
export const updatePricingPlan = async (req: Request, res: Response) => {
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

        const updatedPlan = await PricingPlan.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('formId', 'name slug');

        if (!updatedPlan) {
            return res.status(404).json({ message: "Pricing plan not found" });
        }

        res.status(200).json(updatedPlan);
    } catch (error) {
        res.status(500).json({ message: "Error updating pricing plan", error });
    }
};

// Delete a pricing plan
export const deletePricingPlan = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedPlan = await PricingPlan.findByIdAndDelete(id);

        if (!deletedPlan) {
            return res.status(404).json({ message: "Pricing plan not found" });
        }

        res.status(200).json({ message: "Pricing plan deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting pricing plan", error });
    }
};
