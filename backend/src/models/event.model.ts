import mongoose, { Document, Schema } from "mongoose";

export interface IEvent extends Document {
    title: string;
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
