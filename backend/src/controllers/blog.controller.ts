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
        const noCache = req.query.nocache === '1';
        const cacheKey = `blog_${id}`;

        if (!noCache) {
            const cachedBlog = getCache(cacheKey);
            if (cachedBlog) {
                return res.status(200).json(cachedBlog);
            }
        }

        // Support lookup by slug OR MongoDB _id
        const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;
        const blog = isObjectId
            ? await Blog.findOne({ $or: [{ _id: id }, { slug: id }] })
            : await Blog.findOne({ slug: id });

        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Cache under both id and slug so invalidation hits both
        setCache(`blog_${blog._id}`, blog, 60); // 1 min TTL — short to avoid stale author data
        if (blog.slug) setCache(`blog_${blog.slug}`, blog, 60);

        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: "Error fetching blog", error });
    }
};

// Create a new blog
export const createBlog = async (req: Request, res: Response) => {
    try {
        const { title, content, featuredImage, author, category, tags, seoTitle, seoDescription, focusKeyword, slug: rawSlug } = req.body;

        let processedTags = tags;
        if (Array.isArray(tags)) {
            processedTags = tags.join(",");
        }

        if (!title || !content) {
            return res.status(400).json({ message: "Title and Content are required" });
        }

        let featuredImageUrl = featuredImage;
        if (req.file) {
            featuredImageUrl = `/api/uploads/${req.file.filename}`;
        }

        // Use manually supplied slug if provided, otherwise auto-generate from title
        let slug = rawSlug ? generateSlug(rawSlug) : generateSlug(title);
        const existing = await Blog.findOne({ slug });
        if (existing) slug = `${slug}_${Date.now()}`;

        // Resolve author — multer may give nested object or flat bracket-notation keys
        const resolvedAuthor = (author && typeof author === 'object') ? author : {
            name: req.body['author[name]'],
            designation: req.body['author[designation]'],
            bio: req.body['author[bio]'],
            linkedin: req.body['author[linkedin]'],
        };

        const newBlog = new Blog({
            title,
            slug,
            content,
            featuredImage: featuredImageUrl,
            author: resolvedAuthor,
            category,
            tags: processedTags,
            seoTitle,
            seoDescription,
            focusKeyword,
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
        const { title, author, category, tags, seoTitle, seoDescription, focusKeyword, slug: rawSlug } = req.body;
        
        const updateData: any = {};

        if (title !== undefined) updateData.title = title;
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags.join(",") : tags;
        if (seoTitle !== undefined) updateData.seoTitle = seoTitle;
        if (seoDescription !== undefined) updateData.seoDescription = seoDescription;
        if (focusKeyword !== undefined) updateData.focusKeyword = focusKeyword;
        if (req.body.content !== undefined) updateData.content = req.body.content;

        // Handle author fields — multer parses bracket notation as flat strings
        const authorName = (author && typeof author === 'object' ? author.name : req.body['author[name]']) ?? undefined;
        const authorDesignation = (author && typeof author === 'object' ? author.designation : req.body['author[designation]']) ?? undefined;
        const authorBio = (author && typeof author === 'object' ? author.bio : req.body['author[bio]']) ?? undefined;
        const authorLinkedin = (author && typeof author === 'object' ? author.linkedin : req.body['author[linkedin]']) ?? undefined;

        if (authorName !== undefined) updateData['author.name'] = authorName;
        if (authorDesignation !== undefined) updateData['author.designation'] = authorDesignation;
        if (authorBio !== undefined) updateData['author.bio'] = authorBio;
        if (authorLinkedin !== undefined) updateData['author.linkedin'] = authorLinkedin;

        // Handle featured image
        if (req.file) {
            updateData.featuredImage = `/api/uploads/${req.file.filename}`;
        } else if (req.body.featuredImage) {
            updateData.featuredImage = req.body.featuredImage;
        }

        // Slug handling
        if (rawSlug) {
            let slug = generateSlug(rawSlug);
            const existing = await Blog.findOne({ slug, _id: { $ne: id } });
            if (existing) slug = `${slug}_${Date.now()}`;
            updateData.slug = slug;
        } else if (title) {
            let slug = generateSlug(title);
            const existing = await Blog.findOne({ slug, _id: { $ne: id } });
            if (existing) slug = `${slug}_${Date.now()}`;
            updateData.slug = slug;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, { $set: updateData }, { new: true });

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        // Invalidate ALL possible cache keys for this blog
        deleteCacheByPattern(`blog_${id}`);
        if (updatedBlog.slug) deleteCacheByPattern(`blog_${updatedBlog.slug}`);
        deleteCacheByPattern('blogs_');

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
