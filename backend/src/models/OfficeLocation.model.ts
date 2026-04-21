import mongoose from "mongoose";

const officeLocationSchema = new mongoose.Schema({
    officeTypeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OfficeType",
        required: true
    },

    officeName: {
        type: String,
        required: true
    },

    address: {
        line1: String,
        line2: String,
        city: String,
        state: String,
        country: String,
        pincode: String
    },

    contact: {
        phone: String,
        email: String
    },

    googleMapLink: {
        type: String,
        required: true
    },



    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export default mongoose.model("OfficeLocation", officeLocationSchema);
