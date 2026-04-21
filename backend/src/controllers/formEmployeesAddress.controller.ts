import { Request, Response } from "express";
import FormEmployeesAddress from "../models/FormEmployeesAddress.model";
import Form from "../models/Pages.model";

// Get all form employees addresses
export const getFormEmployeesAddresses = async (req: Request, res: Response) => {
    try {
        const { FormSlug } = req.query;

        const filter: any = {};
        if (FormSlug) {
            filter.FormSlug = FormSlug;
        }

        const addresses = await FormEmployeesAddress.find(filter).sort({ createdAt: -1 });

        // Populate form details for each address
        const populatedAddresses = await Promise.all(
            addresses.map(async (address) => {
                const form = await Form.findOne({ slug: address.FormSlug }).select('name slug');
                return {
                    ...address.toObject(),
                    form: form || { name: 'Unknown', slug: address.FormSlug }
                };
            })
        );

        res.status(200).json(populatedAddresses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching form employees addresses", error });
    }
};

// Get single form employees address by ID
export const getFormEmployeesAddressById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const address = await FormEmployeesAddress.findById(id);

        if (!address) {
            return res.status(404).json({ message: "Form employees address not found" });
        }

        // Get form details
        const form = await Form.findOne({ slug: address.FormSlug }).select('name slug');

        res.status(200).json({
            ...address.toObject(),
            form: form || { name: 'Unknown', slug: address.FormSlug }
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching form employees address", error });
    }
};

// Get form employees addresses by form slug
export const getFormEmployeesAddressesBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const addresses = await FormEmployeesAddress.find({ FormSlug: slug }).sort({ createdAt: -1 });

        // Get form details
        const form = await Form.findOne({ slug }).select('name slug');

        res.status(200).json({
            form: form || { name: 'Unknown', slug },
            addresses
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching form employees addresses by slug", error });
    }
};

// Create a new form employees address
export const createFormEmployeesAddress = async (req: Request, res: Response) => {
    try {
        const { FormSlug, Location, email, phone, officeName, Open, Close, Address, color } = req.body;

        if (!FormSlug || !Location || !email || !Address || !color) {
            return res.status(400).json({
                message: "FormSlug, Location, email, Address, and color are required"
            });
        }

        // Verify form exists by slug
        const form = await Form.findOne({ slug: FormSlug });
        if (!form) {
            return res.status(404).json({ message: "Form not found with the given slug" });
        }

        const newAddress = new FormEmployeesAddress({
            FormSlug,
            Location,
            email,
            phone,
            officeName: officeName || 'Main Office',
            Open: Open || 'Monday',
            Close: Close || 'Friday',
            Address,
            color
        });

        const savedAddress = await newAddress.save();

        res.status(201).json({
            ...savedAddress.toObject(),
            form: { name: form.name, slug: form.slug }
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating form employees address", error });
    }
};

// Update a form employees address
export const updateFormEmployeesAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body };

        // If FormSlug is being updated, verify form exists
        if (updateData.FormSlug) {
            const form = await Form.findOne({ slug: updateData.FormSlug });
            if (!form) {
                return res.status(404).json({ message: "Form not found with the given slug" });
            }
        }

        const updatedAddress = await FormEmployeesAddress.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedAddress) {
            return res.status(404).json({ message: "Form employees address not found" });
        }

        // Get form details
        const form = await Form.findOne({ slug: updatedAddress.FormSlug }).select('name slug');

        res.status(200).json({
            ...updatedAddress.toObject(),
            form: form || { name: 'Unknown', slug: updatedAddress.FormSlug }
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating form employees address", error });
    }
};

// Delete a form employees address
export const deleteFormEmployeesAddress = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedAddress = await FormEmployeesAddress.findByIdAndDelete(id);

        if (!deletedAddress) {
            return res.status(404).json({ message: "Form employees address not found" });
        }

        res.status(200).json({ message: "Form employees address deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting form employees address", error });
    }
};
