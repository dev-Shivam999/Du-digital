import { Request, Response } from "express";
import InvestorCategory from "../models/investorRelation.model";
import InvestorReport from "../models/InvestorReport.model";
import OfficeType from "../models/OfficeType.model";
import OfficeLocation from "../models/OfficeLocation.model";
import { getCache, setCache, deleteCache, deleteCacheByPattern, CACHE_KEYS } from "../utils/cache";

export const getDashboardStats = async (req: Request, res: Response) => {
    try {
        const categoriesCount = await InvestorCategory.countDocuments();
        const reportsCount = await InvestorReport.countDocuments();
        const officeTypesCount = await OfficeType.countDocuments();
        const locationsCount = await OfficeLocation.countDocuments();

        // Recent 5 reports
        const recentReports = await InvestorReport.find()
            .sort({ uploadedDate: -1 })
            .limit(5)
            .populate("categoryId", "name");

        res.status(200).json({
            counts: {
                categories: categoriesCount,
                reports: reportsCount,
                officeTypes: officeTypesCount,
                locations: locationsCount
            },
            recentReports
        });
    } catch (error) {
        console.error("Stats Error", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// Public: Get Category by Slug and its associated active (or all) reports
export const getCategoryBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const isAdmin = req.query.isAdmin === 'true';
        const cacheKey = `${CACHE_KEYS.CATEGORY_REPORTS(slug)}_${isAdmin}`;

        // Check cache first
        const cachedData = getCache(cacheKey);
        if (cachedData && !isAdmin) {
            return res.status(200).json(cachedData);
        }

        const category = await InvestorCategory.findOne({ slug, isActive: true });
        
        
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Fetch related reports
        const filter: any = { categoryId: category._id };
        if (!isAdmin) {
            filter.isActive = true;
        }
        
        const reports = await InvestorReport.find(filter).sort({ financialYear: -1, uploadedDate: -1 });
       
        const responseData = { category, reports };

        // Cache for 5 minutes (only for non-admin requests)
        if (!isAdmin) {
            setCache(cacheKey, responseData, 300);
        }

        return res.status(200).json(responseData);
    } catch (error) {
        console.error("Error fetching category:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Admin: Create a new report
export const createReport = async (req: Request, res: Response) => {
    try {
        const { categoryId, title, financialYear,email } = req.body;
    
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "PDF file is required" });
        }

        // Construct file URL (assuming static serve setup)
        const fileUrl = `/uploads/${file.filename}`;

        const newReport = new InvestorReport({
            categoryId,
            title,
            financialYear,
            email,
            fileUrl
        });

        await newReport.save();

        // Invalidate cache for this category
        deleteCacheByPattern('category_reports_');

        return res.status(201).json(newReport);
    } catch (error) {
        console.error("Error creating report:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Admin: Update a report
export const updateReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, financialYear, isActive ,email} = req.body;

        // Note: File update logic usually involves deleting old file, but for simplicity we'll handle metadata or new file if uploaded
        // If a new file is uploaded, we update the url
        const updateData: any = { title, financialYear, isActive ,email};
        if (req.file) {
            updateData.fileUrl = `/uploads/${req.file.filename}`;
        }

        const updatedReport = await InvestorReport.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedReport) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Invalidate cache
        deleteCacheByPattern('category_reports_');

        return res.status(200).json(updatedReport);
    } catch (error) {
        console.error("Error updating report:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Admin: Delete a report
export const deleteReport = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const deletedReport = await InvestorReport.findByIdAndDelete(id);

        if (!deletedReport) {
            return res.status(404).json({ message: "Report not found" });
        }

        // Invalidate cache
        deleteCacheByPattern('category_reports_');

        // TODO: Optionally delete the file from disk using fs
        return res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("Error deleting report:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Public/Admin: Get all categories (helper for UI)
export const getAllCategories = async (req: Request, res: Response) => {
    try {
        // Check cache first
        const cachedCategories = getCache(CACHE_KEYS.CATEGORIES);
        if (cachedCategories) {
            return res.status(200).json(cachedCategories);
        }

        const categories = await InvestorCategory.find();

        // Cache for 5 minutes
        setCache(CACHE_KEYS.CATEGORIES, categories, 300);

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};

// Admin: Create a new category
export const createCategory = async (req: Request, res: Response) => {
    try {
        const { name, title, sildeImage } = req.body;

        if (!name) {
            return res.status(400).json({ message: "Category name is required" });
        }

        // Generate slug from name
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        // Check if category with same name or slug exists
        const existing = await InvestorCategory.findOne({ $or: [{ name }, { slug }] });
        if (existing) {
            return res.status(400).json({ message: "Category with this name already exists" });
        }

        const newCategory = new InvestorCategory({
            name,
            slug,
            title: title || "",
            sildeImage: sildeImage || ""
        });

        await newCategory.save();

        // Invalidate categories cache
        deleteCache(CACHE_KEYS.CATEGORIES);

        return res.status(201).json(newCategory);
    } catch (error) {
        console.error("Error creating category:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Admin: Update a category
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, title, sildeImage, isActive } = req.body;

        const updateData: any = {};

        if (name) {
            updateData.name = name;
            // Regenerate slug if name changes
            updateData.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        }
        if (title !== undefined) updateData.title = title;
        if (sildeImage !== undefined) updateData.sildeImage = sildeImage;
        if (isActive !== undefined) updateData.isActive = isActive;

        const updatedCategory = await InvestorCategory.findByIdAndUpdate(id, updateData, { new: true });

        if (!updatedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Invalidate categories cache
        deleteCache(CACHE_KEYS.CATEGORIES);
        deleteCacheByPattern('category_reports_');

        return res.status(200).json(updatedCategory);
    } catch (error) {
        console.error("Error updating category:", error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Admin: Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Check if there are reports in this category
        const reportsCount = await InvestorReport.countDocuments({ categoryId: id });
        if (reportsCount > 0) {
            return res.status(400).json({
                message: `Cannot delete category with ${reportsCount} report(s). Delete reports first.`
            });
        }

        const deletedCategory = await InvestorCategory.findByIdAndDelete(id);

        if (!deletedCategory) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Invalidate categories cache
        deleteCache(CACHE_KEYS.CATEGORIES);

        return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        return res.status(500).json({ message: "Server error" });
    }
};
