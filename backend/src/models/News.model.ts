import mongoose from "mongoose";

const newsMediaSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    datePublished: {
        type: Date,
        required: true
    },
    discription: {
        type: String,
        trim: true
    },
    link: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("NewsMedia", newsMediaSchema);
