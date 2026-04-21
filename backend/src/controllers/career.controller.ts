import { Request, Response } from "express";
import Career from "../models/Careers.model";
import { getCache, setCache, deleteCache, CACHE_KEYS } from "../utils/cache";

// Create Career
export const createCareer = async (req: Request, res: Response) => {
    try {
        const {
            title, location, department, experience,
            jobType, description, responsibilities, qualifications
        } = req.body;

        const newCareer = new Career({
            title,
            location,
            department,
            experience,
            jobType,
            description,
            responsibilities,
            qualifications,
            postedDate: new Date()
        });

        await newCareer.save();

        // Invalidate cache
        deleteCache(CACHE_KEYS.CAREERS);

        res.status(201).json(newCareer);
    } catch (error) {
        console.error("Create Career Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Careers
export const getCareers = async (req: Request, res: Response) => {
    try {
        // Check cache
        const cachedCareers = getCache(CACHE_KEYS.CAREERS);
        if (cachedCareers) {
            return res.status(200).json(cachedCareers);
        }

        const careers = await Career.find({ isActive: true }).sort({ createdAt: -1 });

        // Set cache (5 minutes)
        setCache(CACHE_KEYS.CAREERS, careers, 300);

        res.status(200).json(careers);
    } catch (error) {
        console.error("Get Careers Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Career
export const deleteCareer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Career.findByIdAndDelete(id);

        // Invalidate cache
        deleteCache(CACHE_KEYS.CAREERS);

        res.status(200).json({ message: "Career deleted successfully" });
    } catch (error) {
        console.error("Delete Career Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Update Career
export const updateCareer = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const {
            title, location, department, experience,
            jobType, description, responsibilities, qualifications
        } = req.body;

        const updatedCareer = await Career.findByIdAndUpdate(
            id,
            {
                title,
                location,
                department,
                experience,
                jobType,
                description,
                responsibilities,
                qualifications
            },
            { new: true }
        );

        if (!updatedCareer) {
            return res.status(404).json({ message: "Career not found" });
        }

        // Invalidate cache
        deleteCache(CACHE_KEYS.CAREERS);

        res.status(200).json(updatedCareer);
    } catch (error) {
        console.error("Update Career Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};
