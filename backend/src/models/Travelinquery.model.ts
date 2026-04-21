import mongoose from "mongoose";

const travelInquirySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        mobileNumber: {
            type: String,
            required: true,
            trim: true
        },
        adult: {
            type: String,
            required: true,
            trim: true
        },
        child: {
            type: String,
            required: true,
            trim: true
        },
        infant: {
            type: String,
            required: true,
            trim: true
        },
        travelDate: {
            type: String,
            required: true,
            trim: true
        },
        packageId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "TravelPlan",
            required: true,
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("TravelInquiry", travelInquirySchema);
