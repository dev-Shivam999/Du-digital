import mongoose from "mongoose";

const formFieldSchema = new mongoose.Schema(
    {
        formId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Form",
            required: true
        },

        label: {
            type: String,
            required: true
            // "Full Name", "Mobile Number"
        },

        name: {
            type: String,
            required: true
            // "fullName", "mobile"
        },

        type: {
            type: String,
            enum: [
                "text",
                "email",
                "number",
                "date",
                "select",
                "textarea",
                "checkbox",
                "radio"
            ],
            required: true
        },

        placeholder: String,

        parentField: {
            type: String,
            default: null
        }, // Name of the parent field (for cascading dropdowns)

        options: [
            {
                id: String, // Unique ID for the option
                label: String,
                value: String,
                connectId: String // ID of the parent option this depends on
            }
        ], // only for select / radio

        required: {
            type: Boolean,
            default: false
        },

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

export default mongoose.model("FormField", formFieldSchema);
