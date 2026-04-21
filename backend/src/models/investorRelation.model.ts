import mongoose from "mongoose";

const investorCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: ""
    },
    sildeImage: {
        type: String,
        default: "" 
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model(
    "InvestorCategory",
    investorCategorySchema
);
