import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
    {
        otp: {
            type: String,
            required: true
        },
        mobile: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
);

export default mongoose.model("OtpSchema", otpSchema);
