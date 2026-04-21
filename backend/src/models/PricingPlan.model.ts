import mongoose from "mongoose";

const pricingPlanSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },

        planName: {
            type: String,
            required: true
        },

        description: String,

        price: {
            type: String,
            required: true
            // e.g. "₹1499"
        },

        features: [
            {
                type: String
            }
        ],

        order: {
            type: Number,
            default: 0
        },

        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("PricingPlan", pricingPlanSchema);
