import mongoose from "mongoose";

const documentRequirementSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        description: {
            type: String
        },

        applicableFor: {
            type: String
        },

        isMandatory: {
            type: Boolean,
            default: true
        },

        order: {
            type: Number,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model(
    "DocumentRequirement",
    documentRequirementSchema
);
