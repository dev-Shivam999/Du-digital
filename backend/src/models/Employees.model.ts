import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
    },

    phone: {
        type: String,
        trim: true
    },
    CVlink: {
        type: String,
        trim: true
    },
    career: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Career"
    }

}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);