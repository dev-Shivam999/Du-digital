import { Request, Response } from "express";
import TravelPlan from "../models/TravelPackages.model";

// Get all travel packages
export const getAllTravelPackages = async (req: Request, res: Response) => {
    try {
        const packages = await TravelPlan.find().sort({ createdAt: -1 });
        res.status(200).json(packages);
    } catch (error) {
        console.error("Get Travel Packages Error", error);
        res.status(500).json({ message: "Error fetching travel packages", error });
    }
};

// Create a new travel package
export const createTravelPackage = async (req: Request, res: Response) => {
    try {
        const { title, description, startingPrice, isActive } = req.body;
        const file = req.file;

        if (!title) {
            return res.status(400).json({ message: "Title is required" });
        }

        let bannerImage = "";
        if (file) {
            bannerImage = `/uploads/${file.filename}`;
        }

        const newPackage = new TravelPlan({
            title,
            description,
            startingPrice,
            bannerImage,
            isActive: isActive !== undefined ? isActive : true
        });

        const savedPackage = await newPackage.save();
        res.status(201).json(savedPackage);
    } catch (error) {
        console.error("Create Travel Package Error", error);
        res.status(500).json({ message: "Error creating travel package", error });
    }
};

// Update a travel package
export const updateTravelPackage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description, startingPrice, isActive } = req.body;
        const file = req.file;

        const updateData: any = {
            title,
            description,
            startingPrice,
            isActive
        };

        if (file) {
            updateData.bannerImage = `/uploads/${file.filename}`;
        }

        const updatedPackage = await TravelPlan.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedPackage) {
            return res.status(404).json({ message: "Travel package not found" });
        }

        res.status(200).json(updatedPackage);
    } catch (error) {
        console.error("Update Travel Package Error", error);
        res.status(500).json({ message: "Error updating travel package", error });
    }
};

// Delete a travel package
export const deleteTravelPackage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedPackage = await TravelPlan.findByIdAndDelete(id);

        if (!deletedPackage) {
            return res.status(404).json({ message: "Travel package not found" });
        }

        res.status(200).json({ message: "Travel package deleted successfully" });
    } catch (error) {
        console.error("Delete Travel Package Error", error);
        res.status(500).json({ message: "Error deleting travel package", error });
    }
};
