import User from '../models/user.models.mjs';
import bcrypt from 'bcryptjs';
import { generateToken } from '../lib/utils.mjs';
import cloudinary from '../lib/cloudinary.mjs';

const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return re.test(String(email).toLowerCase());
}
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
        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = new User({ email, fullName, password: hashedPassword });
        if (newUser) {
            generateToken(newUser._id, res);
            await newUser.save();
            res.status(201).json(newUser);
        }
        else {
            return res.status(400).json({ message: 'Invalid User Credentials' });
        }
    } catch (error) {
        console.log("Error in signup controller: ", error);
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
    res.send('logout');
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