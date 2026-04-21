import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        },

        featuredImage: {
            type: String,
            trim: true
        },

        author: {
            name: {
                type: String,
                trim: true,
                default: "DU Digital Global"
            },

        },

        category: {
            type: String,
            trim: true
        },

        tags:
        {
            type: String,
            trim: true
        },


        publishedAt: {
            type: Date,
            default: Date.now
        },

    },
    { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
