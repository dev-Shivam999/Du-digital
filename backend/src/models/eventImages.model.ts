import mongoose from "mongoose";

const eventImageSchema = new mongoose.Schema({
    event: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Event",
        required: true
    },
    fileUrl: {
        type: String,
        required: true
    },
}, { timestamps: true });

export default mongoose.model(
    "EventImage",
    eventImageSchema
);
