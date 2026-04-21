import mongoose from "mongoose";

const contentSectionSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
            // Connects section to India eVisa form
        },

        sectionKey: {
            type: String,
            required: true
            // "explore-india"
        },

        title: {
            type: String,
            required: true
        },

        contentHtml: {
            type: String,
            default: ""
            // Made optional - can be empty if using YouTube video
        },

        youtubeUrl: {
            type: String,
            default: ""
            // YouTube video URL (full URL or video ID)
        },

        tableData: {
            headers: [String],
            rows: [[String]]
            // Dynamic table data with headers and rows
        },

        images: {
            type: [String],
            default: []
        },

        badge: {
            text: String,
            background: String
        },

        layout: {
            type: String,
            enum: ["LEFT_TEXT_RIGHT_IMAGE", "RIGHT_TEXT_LEFT_IMAGE"],
            default: "LEFT_TEXT_RIGHT_IMAGE"
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

export default mongoose.model("ContentSection", contentSectionSchema);

