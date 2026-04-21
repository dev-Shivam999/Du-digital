import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: string;
    permissions: string[];
    designation?: string;
    region?: string;
    officeLocationId?: any; // or ObjectId
    isActive?: boolean;
    receivePartnerNotifications?: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, enum: ["admin", "hr", "user", "sales"], default: "user" },
        permissions: [{ type: String }], // e.g., 'manage_blogs', 'manage_team'

        // Sales Expert specific fields
        designation: { type: String },
        region: { type: String },
        phone: { type: String },
        officeLocationId: { type: Schema.Types.ObjectId, ref: "OfficeLocation" },
        isActive: { type: Boolean, default: true },
        receivePartnerNotifications: { type: Boolean, default: false }
    },
    { timestamps: true }
);

// Hash password before saving
UserSchema.pre<IUser>("save", async function (next) {
    if (!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
