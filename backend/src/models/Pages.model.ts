import mongoose from "mongoose";

const formSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        slug: {
            type: String,
        },
        image: {
            type: String,
        },

        description: { type: String },

        adminNotificationEmail: {
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

export default mongoose.model("Form", formSchema);
