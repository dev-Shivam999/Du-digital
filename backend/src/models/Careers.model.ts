import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        location: {
            type: String,
            trim: true
        },
        department: {
            type: String,
            trim: true
        },
        experience: {
            type: String,
            trim: true
        },
        jobType: {
            type: String,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        responsibilities: [
            {
                type: String,
                trim: true
            }
        ],
        qualifications: [
            {
                type: String,
                trim: true
            }
        ],
       
        postedDate: {
            type: Date
        },
        isActive: {
            type: Boolean,
            default: true
        },
       
    },
    { timestamps: true }
);

export default mongoose.model("Career", careerSchema);
