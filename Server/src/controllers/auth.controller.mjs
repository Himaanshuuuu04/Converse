import User from '../models/user.models.mjs';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.mjs';
import cloudinary from '../lib/cloudinary.mjs';
import { sendOTPEmail } from '../lib/email.mjs';
const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(String(email).toLowerCase());
}
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


export const signup = async (req, res) => {
    const { email, fullName, password } = req.body;
    console.log(req.body);
    try {
        if (!email || !fullName || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Email format is invalid' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
        if (user && user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already exist, please login' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
        if(user && !user.isEmailVerified){
            user.password = hashedPassword;
            user.emailOTP = otp;
            user.emailOTPExpires = otpExpires;
            await user.save();
            await sendOTPEmail(email, otp);
            res.status(201).json({ message: 'OTP sent to your email.' });

        }else{
            const newUser = new User({ email, fullName, password: hashedPassword,emailOTP: otp, emailOTPExpires: otpExpires });
            if (newUser) {
                await newUser.save();
                await sendOTPEmail(email, otp);
                res.status(201).json({ message: 'Signup successful. OTP sent to your email.' });
            }
            else {
                return res.status(400).json({ message: 'Invalid User Credentials' });
            }
        }
    } catch (error) {
        console.log("Error in signup controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const verifyOTP = async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({ message: 'Email already verified.' });
        }

        if (!user.emailOTP || user.emailOTP !== otp || user.emailOTPExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isEmailVerified = true;
        user.emailOTP = undefined;
        user.emailOTPExpires = undefined;
        await user.save();

        generateToken(user._id, res);
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'Email format is invalid' });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters long' });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User not found, Invalid credentials' });
        }
        if (!user.isEmailVerified) {
            return res.status(400).json({ message: 'Email not verified. Please verify using OTP.' });
        }
        
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        generateToken(user._id, res);
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in login controller: ", error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie('jwt', "", { maxAge: 0 });
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.log("Error in logout controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const updateProfile = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Uploaded file:", req.file);
        const { fullName, about } = req.body;
        const userId = req.user._id;
        if (!req.file && !fullName && !about) {
            return res.status(400).json({ message: 'No fields to update' });
        }
        let profileImageUrl;
        if (req.file) {
            const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
            const result = await cloudinary.uploader.upload(base64Image, {
                folder: "profile_pictures",
            });
            profileImageUrl = result.secure_url;
        }
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                ...(profileImageUrl && { profileImage: profileImageUrl }),
                ...(fullName && { fullName }),
                ...(about && { about })
            },
            { new: true }
        ).select('-password');

        res.status(200).json(updatedUser);
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller: ", error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};