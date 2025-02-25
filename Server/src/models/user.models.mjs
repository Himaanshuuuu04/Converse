import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 6
        },
        profileImage: {
            type: String,
            default: ""
        },
        about: {
            type: String,
            default: ""
        },
        isEmailVerified: {
            type: Boolean,
            default: false
        },
        emailOTP: {
            type: String
        },
        emailOTPExpires: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", userSchema);

export default User;