import mongoose from "mongoose";

const FormImageSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.String,
            ref: "Form", // slug
            required: true

        },



        title: {
            type: String,
            required: true
        },



        images: {
            type: [String],
            default: []
        },



        isActive: {
            type: Boolean,
            default: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("FormImage", FormImageSchema);
