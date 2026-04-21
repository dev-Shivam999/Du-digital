import mongoose from "mongoose";

const contactInquirySchema = new mongoose.Schema({
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


    message: {
        type: String,
        required: true,
        trim: true
    },


    AllowMsg: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

export default mongoose.model("ContactInquiry", contactInquirySchema);
