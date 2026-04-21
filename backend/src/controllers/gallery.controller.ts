import { Request, Response } from "express";
import Gallery from "../models/Gallery.model";
import { getCache, setCache, deleteCache, CACHE_KEYS } from "../utils/cache";

// Upload Image
export const uploadImage = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const fileUrl = `/uploads/${file.filename}`;

        const newImage = new Gallery({
            FileUser: fileUrl
        });

        await newImage.save();

        // Invalidate cache
        deleteCache(CACHE_KEYS.GALLERY);

        res.status(201).json(newImage);
    } catch (error) {
        console.error("Upload Gallery Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Images
export const getImages = async (req: Request, res: Response) => {
    try {
        const cacheKey = CACHE_KEYS.GALLERY;

        // Check cache
        const cachedImages = getCache(cacheKey);
        if (cachedImages) {
            return res.status(200).json(cachedImages);
        }

        const images = await Gallery.find().sort({ createdAt: -1 });

        // Set cache
        setCache(cacheKey, images, 300);

        res.status(200).json(images);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Image
export const deleteImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await Gallery.findByIdAndDelete(id);

        // Invalidate cache
        deleteCache(CACHE_KEYS.GALLERY);

        // TODO: Remove file from disk
        res.status(200).json({ message: "Image deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};
