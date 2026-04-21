
import { Request, Response } from "express";
import User from "../models/User.model";
import bcrypt from "bcryptjs";

// Add Sales Expert (Creates a User with role 'sales')
export const addSalesExpert = async (req: Request, res: Response) => {
    try {
        const { name, email, password, designation, region, phone, officeLocationId, isActive } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newExpert = await User.create({
            name,
            email,
            password, // User model pre-save hook will hash this
            role: "sales",
            designation,
            region,
            officeLocationId,
            isActive: isActive !== undefined ? isActive : true,
            permissions: [] // Sales experts usually have default role-based permissions
        });

        res.status(201).json({
            message: "Sales Expert added successfully",
            data: {
                _id: newExpert._id,
                name: newExpert.name,
                email: newExpert.email,
                role: newExpert.role,
                designation: newExpert.designation,
                region: newExpert.region,
                officeLocationId: newExpert.officeLocationId
            }
        });
    } catch (error) {
        console.error("Error adding sales expert:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Get All Sales Experts (Users with role 'sales')
export const getSalesExperts = async (req: Request, res: Response) => {
    try {
        const experts = await User.find({ role: "sales" })
            .populate("officeLocationId")
            .select("-password") // Exclude password
            .sort({ createdAt: -1 });

        res.status(200).json({
            message: "Sales Experts fetched successfully",
            data: experts
        });
    } catch (error) {
        console.error("Error fetching sales experts:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Update Sales Expert
export const updateSalesExpert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        const updatedExpert = await User.findOneAndUpdate(
            { _id: id, role: "sales" }, // Ensure we only update sales users via this endpoint
            updates,
            { new: true, runValidators: true }
        ).populate("officeLocationId").select("-password");

        if (!updatedExpert) {
            return res.status(404).json({ message: "Sales Expert not found" });
        }

        res.status(200).json({
            message: "Sales Expert updated successfully",
            data: updatedExpert
        });
    } catch (error) {
        console.error("Error updating sales expert:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Delete Sales Expert
export const deleteSalesExpert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedExpert = await User.findOneAndDelete({ _id: id, role: "sales" });

        if (!deletedExpert) {
            return res.status(404).json({ message: "Sales Expert not found" });
        }

        res.status(200).json({
            message: "Sales Expert deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting sales expert:", error);
        res.status(500).json({ message: "Internal server error", error });
    }
};
