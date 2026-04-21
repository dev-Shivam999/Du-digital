import mongoose from "mongoose";

const formSubmissionSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },
        formSlug: {
            type: String,
            required: true,
            index: true
        },
        formName: {
            type: String,
            required: true
        },
        submissionData: {
            type: mongoose.Schema.Types.Mixed,
            required: true
        },
        userName: {
            type: String,
            trim: true
        },
        userEmail: {
            type: String,
            trim: true
        },
        userPhone: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["new", "read", "responded", "closed"],
            default: "new"
        },
        adminNotes: {
            type: String,
            trim: true
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

// Index for efficient querying
formSubmissionSchema.index({ formId: 1, status: 1 });
formSubmissionSchema.index({ createdAt: -1 });

export default mongoose.model("FormSubmission", formSubmissionSchema);
