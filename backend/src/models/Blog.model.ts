import mongoose from "mongoose";

// title → "My Blog Post!" → "my_blog_post"
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s_-]/g, '')   // remove special chars
        .replace(/\s+/g, '_')             // spaces → underscore
        .replace(/-+/g, '_')              // hyphens → underscore
        .replace(/_+/g, '_')              // collapse multiple underscores
        .replace(/^_|_$/g, '');           // trim leading/trailing
}

const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        slug: {
            type: String,
            trim: true,
            unique: true,
            sparse: true
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

        seoTitle: {
            type: String,
            trim: true
        },

        seoDescription: {
            type: String,
            trim: true
        },

        focusKeyword: {
            type: String,
            trim: true
        },

    },
    { timestamps: true }
);

export default mongoose.model("Blog", blogSchema);
