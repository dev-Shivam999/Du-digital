import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },

        question: {
            type: String,
            required: true
        },

        answer: {
            type: String,
            required: true
            // Can be plain text or HTML
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

export default mongoose.model("FAQ", faqSchema);
