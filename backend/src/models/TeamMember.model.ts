
import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        designation: {
            type: String,
            required: true,
            trim: true
        },

        profileImage: {
            type: String,
            trim: true
        },

        description: {
            type: String,
            trim: true
        },
        category: {
            type: String,
            trim: true
        },
    },
    { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberSchema);
