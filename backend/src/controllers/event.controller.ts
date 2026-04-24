import { Request, Response } from "express";
import Event from "../models/event.model";
import { generateSlug } from "../models/event.model";
import EventImage from "../models/eventImages.model";
import fs from "fs";
import path from "path";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "../utils/cache";
import mongoose from "mongoose";

// Create Event
export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, date, location, description } = req.body;
        const file = req.file;

        if (!title || !date) {
            return res.status(400).json({ message: "Title and Date are required" });
        }

        let imageUrl = "";
        if (file) {
            imageUrl = `/uploads/${file.filename}`;
        }

        // Generate unique slug from title
        let slug = generateSlug(title);
        const existing = await Event.findOne({ slug });
        if (existing) slug = `${slug}_${Date.now()}`;

        const newEvent = new Event({
            title,
            slug,
            date,
            location,
            description,
            imageUrl,
            isGallery: true
        });

        await newEvent.save();

        // Invalidate cache
        deleteCache('events_list');

        res.status(201).json(newEvent);
    } catch (error) {
        console.error("Create Event Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Events
export const getEvents = async (req: Request, res: Response) => {
    try {
        let page
        let limit
        if (req.query.page) {
            page = parseInt(req.query.page as string)
            limit = parseInt(req.query.limit as string)

            const cacheKey = `events_list_${page}_${limit}`;

            // Check cache
            // const cachedEvents = getCache(cacheKey);
            // if (cachedEvents) {
            //     return res.status(200).json(cachedEvents);
            // }

            const skip = (page - 1) * limit;

            const events = await Event.find()
                .skip(skip)
                .limit(limit);

            const total = await Event.countDocuments();

            const responseData = {
                data: events,
                total,
                page,
                totalPages: Math.ceil(total / limit),
                hasMore: page * limit < total
            };

            // Set cache
            setCache(cacheKey, responseData, 300);

            res.status(200).json(responseData);
        } else {
            // Check cache
            const cacheKey = `events_list`;
            const cachedEvents = getCache(cacheKey);
            if (cachedEvents) {
                return res.status(200).json(cachedEvents);
            }


            const events = await Event.aggregate([
                {
                    $lookup: {
                        from: "eventimages",       // collection name
                        localField: "_id",
                        foreignField: "event",
                        as: "gallery"
                    }
                },
                {
                    $addFields: {
                        galleryCount: { $size: "$gallery" }
                    }
                },
                {
                    $project: {
                        gallery: 0   // ❌ remove images array if you only want count
                    }
                }
            ]);



            const responseData = {
                data: events,
                comeWithElse: true
            };

            // Set cache
            setCache(cacheKey, responseData, 300);

            res.status(200).json(responseData);
        }
    } catch (error) {
        console.error("Get Events Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

export const getEventById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Support lookup by slug OR MongoDB _id
        const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
        const event = isObjectId
            ? await Event.findOne({ $or: [{ _id: id }, { slug: id }] })
            : await Event.findOne({ slug: id });

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        res.status(200).json(event);
    } catch (error) {
        console.error("Get Event by ID Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};
// Update Event
export const updateEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, date, location, description } = req.body;
        const file = req.file;

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        event.title = title || event.title;
        event.date = date || event.date;
        event.location = location || event.location;
        event.description = description || event.description;

        // Regenerate slug if title changed
        if (title && title !== event.title) {
            let slug = generateSlug(title);
            const existing = await Event.findOne({ slug, _id: { $ne: id } });
            if (existing) slug = `${slug}_${Date.now()}`;
            (event as any).slug = slug;
        }

        if (file) {
            // Delete old image if exists
            if (event.imageUrl) {
                const oldImagePath = path.join(__dirname, "../../", event.imageUrl);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
            event.imageUrl = `/uploads/${file.filename}`;
        }

        await event.save();

        // Invalidate cache
        deleteCache('events_list');

        res.status(200).json(event);
    } catch (error) {
        console.error("Update Event Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Event
export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Delete event image
        if (event.imageUrl) {
            const imagePath = path.join(__dirname, "../../", event.imageUrl);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Delete associated gallery images
        const galleryImages = await EventImage.find({ event: id });
        galleryImages.forEach(img => {
            const imgPath = path.join(__dirname, "../../", img.fileUrl);
            if (fs.existsSync(imgPath)) {
                fs.unlinkSync(imgPath);
            }
        });
        await EventImage.deleteMany({ event: id });

        await Event.findByIdAndDelete(id);

        // Invalidate caches
        deleteCache('events_list');
        deleteCache(`event_images_${id}`);

        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Delete Event Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Add Event Images (Multi Upload)
export const addEventImages = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const files = req.files as Express.Multer.File[];

        if (!files || files.length === 0) {
            return res.status(400).json({ message: "No images uploaded" });
        }

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        const imagePromises = files.map(file => {
            const newImage = new EventImage({
                event: id,
                fileUrl: `/uploads/${file.filename}`
            });
            return newImage.save();
        });

        const savedImages = await Promise.all(imagePromises);

        // Invalidate cache
        deleteCache(`event_images_${id}`);

        res.status(201).json(savedImages);
    } catch (error) {
        console.error("Add Event Images Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Get Event Images
// Get Event Images — supports slug or _id
export const getEventImages = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cacheKey = `event_images_${id}`;

        const cachedImages = getCache(cacheKey);
        if (cachedImages) {
            return res.status(200).json(cachedImages);
        }

        // Resolve slug → _id if needed
        const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
        let eventId: string = id;
        if (!isObjectId) {
            const event = await Event.findOne({ slug: id }).select('_id');
            if (!event) return res.status(404).json({ message: "Event not found" });
            eventId = (event._id as mongoose.Types.ObjectId).toString();
        }

        const images = await EventImage.find({ event: eventId });

        setCache(cacheKey, images, 300);
        res.status(200).json(images);
    } catch (error) {
        console.error("Get Event Images Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Delete Single Event Image
export const deleteEventImage = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const image = await EventImage.findById(id);

        if (!image) {
            return res.status(404).json({ message: "Image not found" });
        }

        // Delete physical file
        const imagePath = path.join(__dirname, "../../", image.fileUrl);
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        const eventId = image.event;

        await EventImage.findByIdAndDelete(id);

        // Invalidate cache
        deleteCache(`event_images_${eventId}`);

        res.status(200).json({ message: "Image deleted successfully" });
    } catch (error) {
        console.error("Delete Event Image Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};
