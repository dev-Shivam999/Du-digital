import mongoose from "mongoose";

const investorReportSchema = new mongoose.Schema({
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "InvestorCategory",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    fileUrl: {
        type: String,
        required: true
    },
    financialYear: {
        type: String, // e.g. "2023-24"
        default: null
    },
    uploadedDate: {
        type: Date,
        default: Date.now
    },
    email:{
        type:String
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model(
    "InvestorReport",
    investorReportSchema
);
