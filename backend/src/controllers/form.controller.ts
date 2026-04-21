import { Request, Response } from "express";
import Form from "../models/Pages.model";
import FormField from "../models/FormField.model";
import DocumentRequirement from "../models/Documents.model";
import FAQ from "../models/FAQ.model";
import ContentSection from "../models/ContentSection.model";
import PricingPlan from "../models/PricingPlan.model";
import FormImage from "../models/FormImages.model";
import FormEmployeesAddress from "../models/FormEmployeesAddress.model";
import { getCache, setCache, deleteCacheByPattern, CACHE_KEYS, deleteCache } from "../utils/cache";

// Get form by slug with all related data
export const getFormBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
       

        const form = await Form.findOne({ slug });

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        const formId = form._id;


        const [fields, documents, faqs, contentSections, pricingPlans, formImages, formEmployeesAddresses] = await Promise.all([
            FormField.find({ formId }).lean(),
            DocumentRequirement.find({ formId, isActive: true }).lean(),
            FAQ.find({ formId, isActive: true }).lean(),
            ContentSection.find({ formId, isActive: true }).lean(),
            PricingPlan.find({ formId, isActive: true }).lean(),
            FormImage.find({ formId: slug, isActive: true }).lean(),
            FormEmployeesAddress.find({ FormSlug: slug }).lean()
        ]);

        // Group content sections by sectionKey
        const groupedContentSections: { [key: string]: any[] } = {};
        contentSections.forEach((section: any) => {
            const key = section.sectionKey;
            if (!groupedContentSections[key]) {
                groupedContentSections[key] = [];
            }
            groupedContentSections[key].push(section);
        });

        const responseData = {
            ...form.toObject(),
            fields,
            documents,
            faqs,
            contentSections: groupedContentSections,
            pricingPlans,
            formImages,
            formEmployeesAddresses
        };

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching form data", error });
    }
};
// Get all forms
export const getForms = async (req: Request, res: Response) => {
    try {
       

        const forms = await Form.find().sort({ createdAt: -1 });

        // Get field count for each form
        const formsWithFieldCount = await Promise.all(
            forms.map(async (form) => {
                const fieldCount = await FormField.countDocuments({ formId: form._id });
                return {
                    ...form.toObject(),
                    fieldCount
                };
            })
        );

        // Set cache

        res.status(200).json(formsWithFieldCount);
    } catch (error) {
        res.status(500).json({ message: "Error fetching forms", error });
    }
};

// Get single form by ID with its fields
export const getFormById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const form = await Form.findById(id);

        if (!form) {
            return res.status(404).json({ message: "Form not found" });
        }

        const fields = await FormField.find({ formId: id }).sort({ order: 1 });

        res.status(200).json({
            ...form.toObject(),
            fields
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching form", error });
    }
};

// Create a new form with fields
export const createForm = async (req: Request, res: Response) => {
    try {
        const { name, slug, description, isActive, fields, adminNotificationEmail } = req.body;
        const file = (req as any).file;

        if (!name) {
            return res.status(400).json({ message: "Form name is required" });
        }

        // Generate slug if not provided
        const formSlug = slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        // Handle image upload
        let image = "";
        if (file) {
            image = `/uploads/${file.filename}`;
        }

        // Create the form
        const newForm = new Form({
            name,
            slug: formSlug,
            description,
            image,
            adminNotificationEmail,
            isActive: isActive !== undefined ? isActive : true
        });

        const savedForm = await newForm.save();
        let parsedFields = fields;
        if (typeof fields === 'string') {
            try {
                parsedFields = JSON.parse(fields);
            } catch (e) {
                parsedFields = [];
            }
        }

        if (parsedFields && Array.isArray(parsedFields) && parsedFields.length > 0) {
            const formFields = parsedFields.map((field: any, index: number) => ({
                formId: savedForm._id,
                label: field.label,
                name: field.name,
                type: field.type,
                placeholder: field.placeholder,
                options: field.options || [],
                required: field.required || false,
                order: field.order !== undefined ? field.order : index,
                isActive: field.isActive !== undefined ? field.isActive : true,
                parentField: field.parentField || null
            }));

            await FormField.insertMany(formFields);
        }

        // Fetch the form with fields
        const fieldsData = await FormField.find({ formId: savedForm._id }).sort({ order: 1 });

        // Invalidate caches
        deleteCache(CACHE_KEYS.FORMS);
        // We can't easily guess all affected caches, but since this is create, mainly list cache.
        // Also invalidate by pattern just in case
        deleteCacheByPattern('form_');

        res.status(201).json({
            ...savedForm.toObject(),
            fields: fieldsData
        });
    } catch (error) {
        res.status(500).json({ message: "Error creating form", error });
    }
};

// Update a form and its fields
export const updateForm = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, slug, description, isActive, fields, adminNotificationEmail } = req.body;
        const file = (req as any).file;

        // Prepare update data
        const updateData: any = { name, slug, description, isActive, adminNotificationEmail };

        // Handle image upload
        if (file) {
            updateData.image = `/uploads/${file.filename}`;
        }

        // Update form
        const updatedForm = await Form.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        if (!updatedForm) {
            return res.status(404).json({ message: "Form not found" });
        }
        // Update fields if provided
        // Parse fields if sent as JSON string (from form-data)
        let parsedFields = fields;
        if (typeof fields === 'string') {
            try {
                parsedFields = JSON.parse(fields);
            } catch (e) {
                parsedFields = undefined; // Keep undefined to skip field processing if parse fails
            }
        }

        // Only process fields if parsedFields is a valid array (including empty array)
        if (parsedFields !== undefined && Array.isArray(parsedFields)) {
            // Get existing field IDs
            const existingFields = await FormField.find({ formId: id });
            const existingFieldIds = existingFields.map(f => f._id.toString());

            // If parsedFields is empty, delete all existing fields
            if (parsedFields.length === 0) {
                if (existingFieldIds.length > 0) {
                    await FormField.deleteMany({ formId: id });
                    console.log("Deleted all fields for form:", id);
                }
            } else {
                // Track which fields are in the update
                const updatedFieldIds: string[] = [];

                for (let i = 0; i < parsedFields.length; i++) {
                    const field = parsedFields[i];
                    const fieldData = {
                        formId: id,
                        label: field.label,
                        name: field.name,
                        type: field.type,
                        placeholder: field.placeholder,
                        options: field.options || [],
                        required: field.required || false,
                        order: field.order !== undefined ? field.order : i,
                        isActive: field.isActive !== undefined ? field.isActive : true,
                        parentField: field.parentField || null
                    };

                    if (field._id) {
                        // Update existing field
                        await FormField.findByIdAndUpdate(field._id, fieldData);
                        updatedFieldIds.push(field._id);
                    } else {
                        // Create new field
                        const newField = await FormField.create(fieldData);
                        updatedFieldIds.push(newField._id.toString());
                    }
                }

                // Delete fields that are no longer in the update
                const fieldsToDelete = existingFieldIds.filter(fieldId => !updatedFieldIds.includes(fieldId));
                if (fieldsToDelete.length > 0) {
                    await FormField.deleteMany({ _id: { $in: fieldsToDelete } });
                    console.log("Deleted fields:", fieldsToDelete);
                }
            }
        }

        // Fetch the updated form with fields
        const fieldsData = await FormField.find({ formId: id }).sort({ order: 1 });

        // Invalidate caches
        deleteCache(CACHE_KEYS.FORMS);
        deleteCacheByPattern('form_');

        res.status(200).json({
            ...updatedForm.toObject(),
            fields: fieldsData
        });
    } catch (error) {
        res.status(500).json({ message: "Error updating form", error });
    }
};

// Delete a form and its fields
export const deleteForm = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deletedForm = await Form.findByIdAndDelete(id);

        if (!deletedForm) {
            return res.status(404).json({ message: "Form not found" });
        }

        // Delete associated fields
        await FormField.deleteMany({ formId: id });

        // Invalidate caches
        deleteCache(CACHE_KEYS.FORMS);
        deleteCacheByPattern('form_');

        res.status(200).json({ message: "Form and its fields deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting form", error });
    }
};
