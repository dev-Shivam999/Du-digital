import { Request, Response } from "express";
import Blog from "../models/Blog.model";
import { generateSlug } from "../models/Blog.model";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "../utils/cache";
import mongoose from "mongoose";

// Get paginated blogs
export const getBlogs = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        let IsUser = Boolean(req.query.IsUsers as string) || false;

        const cacheKey = `blogs_${page}_${limit}_${IsUser}`;

        // Check cache
        const cachedData = getCache(cacheKey);
        if (cachedData) {
            return res.status(200).json(cachedData);
        }

        const skip = (page - 1) * limit;

        const blogs = IsUser ? await Blog.find()
            .sort({ publishedAt: -1 })
            .skip(skip)
            .limit(limit).select("title slug featuredImage tags") : await Blog.find()
                .sort({ publishedAt: -1 })

        const total = await Blog.countDocuments();

        const responseData = {
            blogs,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total
        };

        // Set cache (5 minutes)
        setCache(cacheKey, responseData, 300);

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blogs", error });
    }
};

// Get single blog by slug or ID
export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cacheKey = `blog_${id}`;

        const cachedBlog = getCache(cacheKey);
        if (cachedBlog) {
            return res.status(200).json(cachedBlog);
        }

        // Support lookup by slug OR MongoDB _id
        const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
        const blog = isObjectId
            ? await Blog.findOne({ $or: [{ _id: id }, { slug: id }] })
            : await Blog.findOne({ slug: id });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        setCache(cacheKey, blog, 300);
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog", error });
    }
};

// Create a new blog
export const createBlog = async (req: Request, res: Response) => {
    try {
        const { title, content, featuredImage, author, category, tags } = req.body;

        let processedTags = tags;
        if (Array.isArray(tags)) {
            processedTags = tags.join(",");
        }

        if (!title || !content) {
            return res.status(400).json({ message: "Title and Content are required" });
        }

        let featuredImageUrl = featuredImage;
        if (req.file) {
            featuredImageUrl = `/uploads/${req.file.filename}`;
        }

        // Generate unique slug from title
        let slug = generateSlug(title);
        const existing = await Blog.findOne({ slug });
        if (existing) slug = `${slug}_${Date.now()}`;

        const newBlog = new Blog({
            title,
            slug,
            content,
            featuredImage: featuredImageUrl,
            author,
            category,
            tags: processedTags
        });

        const savedBlog = await newBlog.save();

        // Invalidate list cache
        deleteCacheByPattern('blogs_');

        res.status(201).json(savedBlog);
    } catch (error) {
        res.status(500).json({ message: "Error creating blog", error });
    }
};

// Update a blog
export const updateBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let updateData: any = { ...req.body };

        if (req.file) {
            updateData.featuredImage = `/uploads/${req.file.filename}`;
        }

        // Regenerate slug if title changed
        if (updateData.title) {
            let slug = generateSlug(updateData.title);
            const existing = await Blog.findOne({ slug, _id: { $ne: id } });
            if (existing) slug = `${slug}_${Date.now()}`;
            updateData.slug = slug;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Invalidate list cache and specific blog cache
        deleteCacheByPattern('blogs_');
        deleteCache(`blog_${id}`);

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: "Error updating blog", error });
    }
};

// Delete a blog
export const deleteBlog = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);

        if (!deletedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Invalidate list cache and specific blog cache
        deleteCacheByPattern('blogs_');
        deleteCache(`blog_${id}`);

        res.status(200).json({ message: "Blog deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting blog", error });
    }
};
