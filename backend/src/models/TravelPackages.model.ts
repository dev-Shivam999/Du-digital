import mongoose from "mongoose";

const travelPlanSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },
        description: {
            type: String,
            trim: true
        },
        startingPrice: {
            type: String
        },

        bannerImage: {
            type: String
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("TravelPlan", travelPlanSchema);
