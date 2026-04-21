import mongoose from "mongoose";

const GallerySchema = new mongoose.Schema({

    FileUser: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    }

}, { timestamps: true });

export default mongoose.model("Gallery", GallerySchema);
