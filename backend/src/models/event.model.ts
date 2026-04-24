import mongoose, { Document, Schema } from "mongoose";

// title → "My Event Name!" → "my_event_name"
export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s_-]/g, '')
        .replace(/\s+/g, '_')
        .replace(/-+/g, '_')
        .replace(/_+/g, '_')
        .replace(/^_|_$/g, '');
}

export interface IEvent extends Document {
    title: string;
    slug: string;
    date?: Date;
    location?: string;
    description?: string;
    imageUrl?: string;
    isGallery: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const eventSchema: Schema = new mongoose.Schema({
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
    date: {
        type: Date
    },
    location: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    },
    isGallery: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model<IEvent>("Event", eventSchema);
