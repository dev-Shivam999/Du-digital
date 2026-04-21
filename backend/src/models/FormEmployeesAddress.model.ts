import mongoose from "mongoose";

const formEmployeesAddressSchema = new mongoose.Schema({
    Location: {
        type: String,
        required: true,
        trim: true
    },
    FormSlug: {
        type: mongoose.Schema.Types.String,
        ref: "Form",
        required: true
    },

    email: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        trim: true
    },
    officeName: {
        type: String,
        required: true,
        default: "Main Office",
        trim: true
    },
    Open: {
        type: String,
        default: "Monday",
        trim: true
    },
    Close: {
        type: String,
        default: "Friday",
        trim: true
    },

    Address: {
        type: String,
        required: true,
        trim: true
    },
    color: {
        type: String,
        required: true
    }


}, { timestamps: true });

export default mongoose.model("FormEmployeesAddress", formEmployeesAddressSchema);

