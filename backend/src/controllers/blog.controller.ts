import { Request, Response } from "express";
import Blog from "../models/Blog.model";
import { getCache, setCache, deleteCache, deleteCacheByPattern } from "../utils/cache";

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
            .limit(limit).select("title featuredImage tags") : await Blog.find()
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

// Get single blog by ID
export const getBlogById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const cacheKey = `blog_${id}`;

        // Check cache
        const cachedBlog = getCache(cacheKey);
        if (cachedBlog) {
            return res.status(200).json(cachedBlog);
        }

        const blog = await Blog.findById(id);

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Set cache (5 minutes)
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

        const newBlog = new Blog({
            title,
            content,
            featuredImage: featuredImageUrl,
            author, // Expecting { name: string } or can use default
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
        let updateData = { ...req.body };

        if (req.file) {
            updateData.featuredImage = `/uploads/${req.file.filename}`;
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
